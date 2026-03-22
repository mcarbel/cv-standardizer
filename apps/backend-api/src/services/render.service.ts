import fs from 'node:fs/promises';
import path from 'node:path';
import { Document, Packer, Paragraph, TextRun } from 'docx';
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
          children: [
            new Paragraph({
              children: [new TextRun({ text: cv.fullName || 'CV Standardise', bold: true, size: 32 })]
            }),
            new Paragraph(cv.title || 'Consultant / Expert'),
            ...cv.summaryLines.map((line: string) => new Paragraph(line))
          ]
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
