import fs from 'node:fs/promises';
import path from 'node:path';
import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TabStopPosition,
  TabStopType,
  TextRun
} from 'docx';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import type { CVData, OutputFormat } from '@cv-standardizer/shared-contracts';

export async function renderOutput(
  cv: CVData,
  outputFormat: OutputFormat,
  outputDir: string,
  baseName: string
): Promise<string> {
  if (outputFormat === 'markdown') {
    const outputPath = path.join(outputDir, `${baseName}.md`);
    await fs.writeFile(outputPath, renderMarkdown(cv), 'utf-8');
    return outputPath;
  }

  if (outputFormat === 'docx') {
    const outputPath = path.join(outputDir, `${baseName}.docx`);
    const doc = new Document({
      sections: [
        {
          children: buildDocxSections(cv)
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

function buildDocxSections(cv: CVData): Paragraph[] {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: cv.fullName || 'CV Standardise', bold: true, size: 34, color: '1D4ED8' })]
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: cv.title || 'Consultant / Expert', italics: true, size: 24, color: '334155' })]
    }),
    new Paragraph({
      border: {
        bottom: {
          color: 'CBD5E1',
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6
        }
      },
      spacing: { after: 200 }
    })
  ];

  pushHeading(paragraphs, 'Summary');
  pushBullets(paragraphs, cv.summaryLines, '334155');

  pushHeading(paragraphs, 'Key Expertise');
  pushCompactBullets(paragraphs, cv.keyExpertise);

  pushHeading(paragraphs, 'Technical Skills');
  for (const [category, skills] of Object.entries(cv.technicalSkills)) {
    paragraphs.push(
      new Paragraph({
        spacing: { after: 90 },
        children: [
          new TextRun({ text: `${category}: `, bold: true, color: '0F172A' }),
          new TextRun({ text: skills.join(', '), color: '334155' })
        ]
      })
    );
  }

  pushHeading(paragraphs, 'Professional Experience');
  for (const experience of cv.experiences) {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 160, after: 40 },
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [
          new TextRun({ text: experience.title || experience.role || 'Experience', bold: true, size: 24, color: '0F172A' }),
          new TextRun({ text: '\t' }),
          new TextRun({ text: experience.dates || '', bold: true, color: '475569' })
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
              color: '475569'
            })
          ]
        })
      );
    }

    if (experience.context) {
      paragraphs.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [new TextRun({ text: experience.context, color: '334155' })]
        })
      );
    }

    if (experience.achievements.length > 0) {
      paragraphs.push(sectionLabel('Achievements'));
      pushCompactBullets(paragraphs, experience.achievements);
    }

    if (experience.results.length > 0) {
      paragraphs.push(sectionLabel('Results'));
      pushCompactBullets(paragraphs, experience.results);
    }
  }

  pushHeading(paragraphs, 'Education');
  pushCompactBullets(paragraphs, cv.education);

  pushHeading(paragraphs, 'Languages');
  pushCompactBullets(paragraphs, cv.languages);

  pushHeading(paragraphs, 'Certifications');
  pushCompactBullets(paragraphs, cv.certifications);

  return paragraphs;
}

function pushHeading(paragraphs: Paragraph[], title: string): void {
  paragraphs.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 120 },
      border: {
        bottom: {
          color: 'DBEAFE',
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6
        }
      },
      children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 22, color: '1D4ED8' })]
    })
  );
}

function pushBullets(paragraphs: Paragraph[], lines: string[], color = '0F172A'): void {
  lines
    .filter(Boolean)
    .forEach((line) => {
      paragraphs.push(
        new Paragraph({
          spacing: { after: 80 },
          bullet: {
            level: 0
          },
          children: [new TextRun({ text: line, color })]
        })
      );
    });
}

function pushCompactBullets(paragraphs: Paragraph[], lines: string[]): void {
  lines
    .filter(Boolean)
    .forEach((line) => {
      paragraphs.push(
        new Paragraph({
          spacing: { after: 40 },
          bullet: {
            level: 0
          },
          children: [new TextRun({ text: line, color: '334155' })]
        })
      );
    });
}

function sectionLabel(value: string): Paragraph {
  return new Paragraph({
    spacing: { before: 60, after: 30 },
    children: [new TextRun({ text: value, bold: true, color: '0F172A' })]
  });
}
