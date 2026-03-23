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
  TextRun
} from 'docx';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import type { CVData, OutputFormat, TemplateStyle, CreateJobRequestFields } from '@cv-standardizer/shared-contracts';

interface RenderTheme {
  titleColor: string;
  subtitleColor: string;
  bodyColor: string;
  sectionColor: string;
}

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
  return [
    `# ${cv.fullName || 'CV Standardise'}`,
    '',
    cv.title || 'Consultant / Expert',
    '',
    '## Summary',
    ...cv.summaryLines,
    '',
    '## Skills',
    ...Object.entries(cv.technicalSkills).flatMap(([category, skills]: [string, string[]]) => [`- ${category}: ${skills.join(', ')}`])
  ].join('\n');
}

async function buildDocxSections(
  cv: CVData,
  templateStyle: TemplateStyle,
  theme: RenderTheme,
  logoData?: Buffer
): Promise<Paragraph[]> {
  if (templateStyle === 'consulting') {
    return buildConsultingTemplate(cv, theme, logoData);
  }

  if (templateStyle === 'modern') {
    return buildModernTemplate(cv, theme);
  }

  return buildStandardTemplate(cv, theme);
}

function buildStandardTemplate(cv: CVData, theme: RenderTheme): Paragraph[] {
  const paragraphs: Paragraph[] = [
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

  pushHeading(paragraphs, 'Summary', theme);
  pushBullets(paragraphs, cv.summaryLines, theme.bodyColor, false);

  pushHeading(paragraphs, 'Key Expertise', theme);
  pushBullets(paragraphs, cv.keyExpertise, theme.bodyColor, true);

  pushHeading(paragraphs, 'Technical Skills', theme);
  for (const [category, skills] of Object.entries(cv.technicalSkills)) {
    paragraphs.push(labeledParagraph(category, skills.join(', '), theme));
  }

  pushExperienceSection(paragraphs, cv, theme, 'standard');
  pushSimpleSection(paragraphs, 'Education', cv.education, theme);
  pushSimpleSection(paragraphs, 'Languages', cv.languages, theme);
  pushSimpleSection(paragraphs, 'Certifications', cv.certifications, theme);

  return paragraphs;
}

function buildModernTemplate(cv: CVData, theme: RenderTheme): Paragraph[] {
  const paragraphs: Paragraph[] = [
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

  pushHeading(paragraphs, 'Executive Summary', theme);
  cv.summaryLines.forEach((line) => paragraphs.push(bodyParagraph(line, theme.bodyColor)));

  pushHeading(paragraphs, 'Core Expertise', theme);
  paragraphs.push(bodyParagraph(cv.keyExpertise.join(' • '), theme.bodyColor));

  pushHeading(paragraphs, 'Technology Landscape', theme);
  for (const [category, skills] of Object.entries(cv.technicalSkills)) {
    paragraphs.push(labeledParagraph(category, skills.join(' • '), theme));
  }

  pushExperienceSection(paragraphs, cv, theme, 'modern');
  pushSimpleSection(paragraphs, 'Education', cv.education, theme);
  pushSimpleSection(paragraphs, 'Languages', cv.languages, theme);
  pushSimpleSection(paragraphs, 'Certifications', cv.certifications, theme);

  return paragraphs;
}

function buildConsultingTemplate(cv: CVData, theme: RenderTheme, logoData?: Buffer): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  if (logoData) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 120 },
        children: [
          new ImageRun({
            type: 'svg',
            data: logoData,
            fallback: {
              type: 'png',
              data: PNG_FALLBACK_PIXEL
            },
            transformation: {
              width: 180,
              height: 48
            }
          })
        ]
      })
    );
  }

  paragraphs.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [new TextRun({ text: cv.fullName || 'CV Standardise', bold: true, size: 36, color: theme.titleColor })]
    }),
    new Paragraph({
      spacing: { after: 60 },
      children: [new TextRun({ text: cv.title || 'Consultant / Expert', size: 24, color: theme.subtitleColor })]
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

  pushHeading(paragraphs, 'Profile', theme);
  cv.summaryLines.forEach((line) => paragraphs.push(bodyParagraph(line, theme.bodyColor)));

  pushHeading(paragraphs, 'Selected Expertise', theme);
  pushBullets(paragraphs, cv.keyExpertise, theme.bodyColor, true);

  pushHeading(paragraphs, 'Capabilities', theme);
  for (const [category, skills] of Object.entries(cv.technicalSkills)) {
    paragraphs.push(labeledParagraph(category, skills.join(', '), theme));
  }

  pushExperienceSection(paragraphs, cv, theme, 'consulting');
  pushSimpleSection(paragraphs, 'Education', cv.education, theme);
  pushSimpleSection(paragraphs, 'Languages', cv.languages, theme);
  pushSimpleSection(paragraphs, 'Certifications', cv.certifications, theme);

  return paragraphs;
}

function pushExperienceSection(
  paragraphs: Paragraph[],
  cv: CVData,
  theme: RenderTheme,
  variant: TemplateStyle
): void {
  pushHeading(paragraphs, 'Professional Experience', theme);

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
      paragraphs.push(sectionLabel('Achievements', theme));
      pushBullets(paragraphs, experience.achievements, theme.bodyColor, true);
    }

    if (experience.results.length > 0) {
      paragraphs.push(sectionLabel('Results', theme));
      pushBullets(paragraphs, experience.results, theme.bodyColor, true);
    }
  }
}

function pushSimpleSection(paragraphs: Paragraph[], title: string, lines: string[], theme: RenderTheme): void {
  pushHeading(paragraphs, title, theme);
  pushBullets(paragraphs, lines, theme.bodyColor, true);
}

function pushHeading(paragraphs: Paragraph[], title: string, theme: RenderTheme): void {
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

function pushBullets(paragraphs: Paragraph[], lines: string[], color: string, compact: boolean): void {
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
