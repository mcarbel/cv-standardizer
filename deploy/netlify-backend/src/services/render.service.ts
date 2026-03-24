import fs from 'node:fs/promises';
import path from 'node:path';
import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  TabStopPosition,
  TabStopType,
  Table,
  TableCell,
  TableRow,
  TextRun
} from 'docx';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import type { CVData, OutputFormat, OutputLanguage, TemplateStyle, CreateJobRequestFields } from '@cv-standardizer/shared-contracts';

interface RenderTheme {
  titleColor: string;
  subtitleColor: string;
  bodyColor: string;
  sectionColor: string;
}

interface RenderLabels {
  summary: string;
  keyExpertise: string;
  technicalSkills: string;
  professionalExperience: string;
  education: string;
  languages: string;
  certifications: string;
  executiveSummary: string;
  coreExpertise: string;
  technologyLandscape: string;
  consultantProfile: string;
  profile: string;
  capabilities: string;
  contact: string;
  candidate: string;
  title: string;
  expertise: string;
  snapshot: string;
  achievements: string;
  results: string;
}

type SectionChild = Paragraph | Table;

const LOGO_PATH = path.resolve(process.cwd(), 'apps/backend-api/assets/BraineeSys_Logo_Black.svg');
const PNG_FALLBACK_PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4////fwAJ+wP9KobjigAAAABJRU5ErkJggg==',
  'base64'
);

export async function renderOutput(
  cv: CVData,
  outputFormat: OutputFormat,
  outputDir: string,
  baseName: string,
  renderOptions?: CreateJobRequestFields
): Promise<string> {
  if (outputFormat === 'markdown') {
    const outputPath = path.join(outputDir, `${baseName}.md`);
    await fs.writeFile(outputPath, renderMarkdown(cv), 'utf-8');
    return outputPath;
  }

  if (outputFormat === 'docx') {
    const outputPath = path.join(outputDir, `${baseName}.docx`);
    const templateStyle = renderOptions?.templateStyle || 'standard';
    const theme = resolveTheme(renderOptions);
    const logoData = templateStyle === 'consulting' ? await loadLogoIfAvailable() : undefined;
    const doc = new Document({
      sections: [
        {
          children: await buildDocxSections(cv, templateStyle, theme, logoData)
        }
      ]
    });
    const buffer = await Packer.toBuffer(doc);
    await fs.writeFile(outputPath, buffer);
    return outputPath;
  }

  const outputPath = path.join(outputDir, `${baseName}.pdf`);
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  page.drawText(`${cv.fullName || 'CV Standardise'}\n${cv.title || ''}`, {
    x: 50,
    y: 760,
    size: 14,
    font
  });
  await fs.writeFile(outputPath, await pdf.save());
  return outputPath;
}

function renderMarkdown(cv: CVData): string {
  const labels = getRenderLabels(cv.meta.outputLanguage || 'en');
  return [
    `# ${cv.fullName || 'CV Standardise'}`,
    '',
    cv.title || 'Consultant / Expert',
    '',
    `## ${labels.summary}`,
    ...cv.summaryLines,
    '',
    `## ${labels.technicalSkills}`,
    ...Object.entries(cv.technicalSkills).flatMap(([category, skills]: [string, string[]]) => [`- ${category}: ${skills.join(', ')}`])
  ].join('\n');
}

async function buildDocxSections(
  cv: CVData,
  templateStyle: TemplateStyle,
  theme: RenderTheme,
  logoData?: Buffer
): Promise<SectionChild[]> {
  const labels = getRenderLabels(cv.meta.outputLanguage || 'en');
  if (templateStyle === 'consulting') {
    return buildConsultingTemplate(cv, theme, labels, logoData);
  }

  if (templateStyle === 'modern') {
    return buildModernTemplate(cv, theme, labels);
  }

  return buildStandardTemplate(cv, theme, labels);
}

function buildStandardTemplate(cv: CVData, theme: RenderTheme, labels: RenderLabels): SectionChild[] {
  const paragraphs: SectionChild[] = [
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: cv.fullName || 'CV Standardise', bold: true, size: 34, color: theme.titleColor })]
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: cv.title || 'Consultant / Expert', italics: true, size: 24, color: theme.subtitleColor })]
    }),
    divider()
  ];

  pushHeading(paragraphs, labels.summary, theme);
  pushBullets(paragraphs, cv.summaryLines, theme.bodyColor, false);

  pushHeading(paragraphs, labels.keyExpertise, theme);
  pushBullets(paragraphs, cv.keyExpertise, theme.bodyColor, true);

  pushHeading(paragraphs, labels.technicalSkills, theme);
  for (const [category, skills] of Object.entries(cv.technicalSkills)) {
    paragraphs.push(labeledParagraph(category, skills.join(', '), theme));
  }

  pushExperienceSection(paragraphs, cv, theme, labels, 'standard');
  pushSimpleSection(paragraphs, labels.education, cv.education, theme);
  pushSimpleSection(paragraphs, labels.languages, cv.languages, theme);
  pushSimpleSection(paragraphs, labels.certifications, cv.certifications, theme);

  return paragraphs;
}

function buildModernTemplate(cv: CVData, theme: RenderTheme, labels: RenderLabels): SectionChild[] {
  const paragraphs: SectionChild[] = [
    new Paragraph({
      shading: {
        fill: theme.sectionColor
      },
      spacing: { after: 40 },
      children: [new TextRun({ text: cv.fullName || 'CV Standardise', bold: true, size: 34, color: 'FFFFFF' })]
    }),
    new Paragraph({
      spacing: { after: 160 },
      children: [new TextRun({ text: cv.title || 'Consultant / Expert', bold: true, color: theme.subtitleColor, size: 22 })]
    })
  ];

  pushHeading(paragraphs, labels.executiveSummary, theme);
  cv.summaryLines.forEach((line) => paragraphs.push(bodyParagraph(line, theme.bodyColor)));

  pushHeading(paragraphs, labels.coreExpertise, theme);
  paragraphs.push(bodyParagraph(cv.keyExpertise.join(' • '), theme.bodyColor));

  pushHeading(paragraphs, labels.technologyLandscape, theme);
  for (const [category, skills] of Object.entries(cv.technicalSkills)) {
    paragraphs.push(labeledParagraph(category, skills.join(' • '), theme));
  }

  pushExperienceSection(paragraphs, cv, theme, labels, 'modern');
  pushSimpleSection(paragraphs, labels.education, cv.education, theme);
  pushSimpleSection(paragraphs, labels.languages, cv.languages, theme);
  pushSimpleSection(paragraphs, labels.certifications, cv.certifications, theme);

  return paragraphs;
}

function buildConsultingTemplate(cv: CVData, theme: RenderTheme, labels: RenderLabels, logoData?: Buffer): SectionChild[] {
  const children: SectionChild[] = [];

  children.push(
    buildConsultingHero(cv, theme, labels, logoData),
    new Paragraph({
      spacing: { after: 60 },
      children: [new TextRun({ text: labels.consultantProfile.toUpperCase(), bold: true, color: theme.sectionColor, size: 18 })]
    }),
    new Paragraph({
      spacing: { after: 200 },
      border: {
        bottom: {
          color: theme.sectionColor,
          style: BorderStyle.SINGLE,
          size: 10,
          space: 1
        }
      }
    })
  );

  children.push(buildConsultingBody(cv, theme, labels));

  return children;
}

function pushExperienceSection(
  paragraphs: SectionChild[],
  cv: CVData,
  theme: RenderTheme,
  labels: RenderLabels,
  variant: TemplateStyle
): void {
  pushHeading(paragraphs, labels.professionalExperience, theme);

  for (const experience of cv.experiences) {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 160, after: 40 },
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [
          new TextRun({ text: experience.title || experience.role || 'Experience', bold: true, size: variant === 'consulting' ? 25 : 24, color: theme.titleColor }),
          new TextRun({ text: '\t' }),
          new TextRun({ text: experience.dates || '', bold: true, color: theme.subtitleColor })
        ]
      })
    );

    if (experience.role || experience.sector) {
      paragraphs.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: `${experience.role || ''}${experience.role && experience.sector ? ' - ' : ''}${experience.sector || ''}`,
              italics: true,
              color: theme.subtitleColor
            })
          ]
        })
      );
    }

    if (experience.context) {
      paragraphs.push(bodyParagraph(experience.context, theme.bodyColor));
    }

    if (experience.achievements.length > 0) {
      paragraphs.push(sectionLabel(labels.achievements, theme));
      pushBullets(paragraphs, experience.achievements, theme.bodyColor, true);
    }

    if (experience.results.length > 0) {
      paragraphs.push(sectionLabel(labels.results, theme));
      pushBullets(paragraphs, experience.results, theme.bodyColor, true);
    }
  }
}

function pushSimpleSection(paragraphs: SectionChild[], title: string, lines: string[], theme: RenderTheme): void {
  pushHeading(paragraphs, title, theme);
  pushBullets(paragraphs, lines, theme.bodyColor, true);
}

function pushHeading(paragraphs: SectionChild[], title: string, theme: RenderTheme): void {
  paragraphs.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 120 },
      border: {
        bottom: {
          color: theme.sectionColor,
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6
        }
      },
      children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 22, color: theme.sectionColor })]
    })
  );
}

function pushBullets(paragraphs: SectionChild[], lines: string[], color: string, compact: boolean): void {
  lines
    .filter(Boolean)
    .forEach((line) => {
      paragraphs.push(
        new Paragraph({
          spacing: { after: compact ? 40 : 80 },
          bullet: {
            level: 0
          },
          children: [new TextRun({ text: line, color })]
        })
      );
    });
}

function labeledParagraph(label: string, value: string, theme: RenderTheme): Paragraph {
  return new Paragraph({
    spacing: { after: 90 },
    children: [
      new TextRun({ text: `${label}: `, bold: true, color: theme.titleColor }),
      new TextRun({ text: value, color: theme.bodyColor })
    ]
  });
}

function bodyParagraph(value: string, color: string): Paragraph {
  return new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text: value, color })]
  });
}

function sectionLabel(value: string, theme: RenderTheme): Paragraph {
  return new Paragraph({
    spacing: { before: 60, after: 30 },
    children: [new TextRun({ text: value, bold: true, color: theme.titleColor })]
  });
}

function buildConsultingBody(cv: CVData, theme: RenderTheme, labels: RenderLabels): Table {
  return new Table({
    width: { size: 100, type: 'pct' },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: 'pct' },
            margins: { top: 120, bottom: 120, left: 120, right: 180 },
            borders: noBorders(),
            shading: { fill: 'F8FAFC' },
            children: buildConsultingSidebar(cv, theme, labels)
          }),
          new TableCell({
            width: { size: 70, type: 'pct' },
            margins: { top: 120, bottom: 120, left: 180, right: 60 },
            borders: noBorders(),
            children: buildConsultingMainColumn(cv, theme, labels)
          })
        ]
      })
    ]
  });
}

function buildConsultingHero(cv: CVData, theme: RenderTheme, labels: RenderLabels, logoData?: Buffer): Table {
  return new Table({
    width: { size: 100, type: 'pct' },
    borders: noBorders(),
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 64, type: 'pct' },
            margins: { top: 80, bottom: 120, left: 0, right: 180 },
            borders: noBorders(),
            children: [
              new Paragraph({
                spacing: { after: 100 },
                children: [new TextRun({ text: cv.fullName || 'CV Standardise', bold: true, size: 36, color: theme.titleColor })]
              }),
              new Paragraph({
                spacing: { after: 120 },
                children: [new TextRun({ text: cv.title || 'Consultant / Expert', size: 24, color: theme.subtitleColor })]
              }),
              new Paragraph({
                spacing: { after: 60 },
                children: [new TextRun({ text: 'Client-ready profile prepared for presentation and interview shortlisting.', color: theme.bodyColor })]
              })
            ]
          }),
          new TableCell({
            width: { size: 36, type: 'pct' },
            margins: { top: 60, bottom: 120, left: 180, right: 0 },
            borders: noBorders(),
            shading: { fill: 'F8FAFC' },
            children: buildConsultingContactCard(cv, theme, labels, logoData)
          })
        ]
      })
    ]
  });
}

function buildConsultingSidebar(cv: CVData, theme: RenderTheme, labels: RenderLabels): Paragraph[] {
  const sidebar: Paragraph[] = [];

  pushSidebarHeading(sidebar, labels.snapshot, theme);
  pushBullets(sidebar, cv.summaryLines.slice(0, 3), theme.bodyColor, true);

  pushSidebarHeading(sidebar, labels.expertise, theme);
  pushBullets(sidebar, cv.keyExpertise.slice(0, 8), theme.bodyColor, true);

  pushSidebarHeading(sidebar, labels.languages, theme);
  pushBullets(sidebar, cv.languages, theme.bodyColor, true);

  pushSidebarHeading(sidebar, labels.certifications, theme);
  pushBullets(sidebar, cv.certifications.slice(0, 8), theme.bodyColor, true);

  return sidebar;
}

function buildConsultingContactCard(cv: CVData, theme: RenderTheme, labels: RenderLabels, logoData?: Buffer): Paragraph[] {
  const lines = deriveContactLines(cv, labels);

  return [
    ...(logoData ? [new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 90 },
      children: [
        new ImageRun({
          type: 'svg',
          data: logoData,
          fallback: {
            type: 'png',
            data: PNG_FALLBACK_PIXEL
          },
          transformation: {
            width: 122,
            height: 33
          }
        })
      ]
    })] : []),
    new Paragraph({
      spacing: { after: 60 },
      children: [new TextRun({ text: labels.contact.toUpperCase(), bold: true, color: theme.sectionColor, size: 18 })]
    }),
    ...lines.map(([label, value]) => new Paragraph({
      spacing: { after: 55 },
      children: [
        new TextRun({ text: `${label}: `, bold: true, color: theme.titleColor }),
        new TextRun({ text: value, color: theme.bodyColor })
      ]
    }))
  ];
}

function buildConsultingMainColumn(cv: CVData, theme: RenderTheme, labels: RenderLabels): Paragraph[] {
  const content: Paragraph[] = [];

  pushHeading(content, labels.profile, theme);
  cv.summaryLines.forEach((line) => content.push(bodyParagraph(line, theme.bodyColor)));

  pushHeading(content, labels.capabilities, theme);
  for (const [category, skills] of Object.entries(cv.technicalSkills)) {
    content.push(labeledParagraph(category, skills.join(', '), theme));
  }

  pushExperienceSection(content, cv, theme, labels, 'consulting');
  pushSimpleSection(content, labels.education, cv.education, theme);

  return content;
}

function pushSidebarHeading(paragraphs: Paragraph[], title: string, theme: RenderTheme): void {
  paragraphs.push(
    new Paragraph({
      spacing: { before: 120, after: 60 },
      children: [new TextRun({ text: title.toUpperCase(), bold: true, color: theme.sectionColor, size: 18 })]
    })
  );
}

function noBorders() {
  return {
    top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
  };
}

function deriveContactLines(cv: CVData, labels: RenderLabels): Array<[string, string]> {
  const languageSummary = cv.languages.filter(Boolean).slice(0, 3).join(', ');
  const expertiseSummary = cv.keyExpertise.filter(Boolean).slice(0, 3).join(', ');
  const isFrench = cv.meta.outputLanguage === 'fr';
  const availability = cv.meta?.anonymized
    ? (isFrench ? 'Coordonnees disponibles sur demande' : 'Contact details available on request')
    : (isFrench ? 'Partage via BraineeSys sur demande' : 'Shared through BraineeSys on request');
  const unavailable = isFrench ? 'Disponible sur demande' : 'Available on request';

  return [
    [labels.candidate, cv.fullName || 'Confidential Candidate'],
    [labels.title, cv.title || 'Consultant / Expert'],
    [labels.languages, languageSummary || unavailable],
    [labels.expertise, expertiseSummary || unavailable],
    [labels.contact, availability]
  ];
}

function getRenderLabels(outputLanguage: OutputLanguage): RenderLabels {
  if (outputLanguage === 'fr') {
    return {
      summary: 'Resume',
      keyExpertise: 'Expertise Cle',
      technicalSkills: 'Competences Techniques',
      professionalExperience: 'Experience Professionnelle',
      education: 'Formation',
      languages: 'Langues',
      certifications: 'Certifications',
      executiveSummary: 'Synthese Executive',
      coreExpertise: 'Expertise Principale',
      technologyLandscape: 'Paysage Technologique',
      consultantProfile: 'Profil Consultant',
      profile: 'Profil',
      capabilities: 'Capacites',
      contact: 'Contact',
      candidate: 'Candidat',
      title: 'Titre',
      expertise: 'Expertise',
      snapshot: 'Synthese',
      achievements: 'Realisations',
      results: 'Resultats'
    };
  }

  return {
    summary: 'Summary',
    keyExpertise: 'Key Expertise',
    technicalSkills: 'Technical Skills',
    professionalExperience: 'Professional Experience',
    education: 'Education',
    languages: 'Languages',
    certifications: 'Certifications',
    executiveSummary: 'Executive Summary',
    coreExpertise: 'Core Expertise',
    technologyLandscape: 'Technology Landscape',
    consultantProfile: 'Consultant Profile',
    profile: 'Profile',
    capabilities: 'Capabilities',
    contact: 'Contact',
    candidate: 'Candidate',
    title: 'Title',
    expertise: 'Expertise',
    snapshot: 'Snapshot',
    achievements: 'Achievements',
    results: 'Results'
  };
}

function divider(): Paragraph {
  return new Paragraph({
    border: {
      bottom: {
        color: 'CBD5E1',
        space: 1,
        style: BorderStyle.SINGLE,
        size: 6
      }
    },
    spacing: { after: 200 }
  });
}

function resolveTheme(renderOptions?: CreateJobRequestFields): RenderTheme {
  return {
    titleColor: normalizeColor(renderOptions?.titleColor, '1D4ED8'),
    subtitleColor: normalizeColor(renderOptions?.subtitleColor, '334155'),
    bodyColor: normalizeColor(renderOptions?.bodyColor, '334155'),
    sectionColor: normalizeColor(renderOptions?.sectionColor, '1D4ED8')
  };
}

function normalizeColor(value: string | undefined, fallback: string): string {
  if (!value) {
    return fallback;
  }

  const normalized = value.replace('#', '').trim();
  if (/^[0-9A-Fa-f]{6}$/.test(normalized)) {
    return normalized.toUpperCase();
  }

  return fallback;
}

async function loadLogoIfAvailable(): Promise<Buffer | undefined> {
  try {
    return await fs.readFile(LOGO_PATH);
  } catch (_error) {
    return undefined;
  }
}
