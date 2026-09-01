import JSZip from 'jszip';
import { PDFDocument, StandardFonts, rgb, type PDFImage, type PDFFont, type PDFPage, type RGB } from 'pdf-lib';
import { braineeSysLogoPngBytes } from './logoAsset';
import type { CVData, OutputFormat, OutputLanguage, TemplateStyle } from './types';

export interface RenderedOutput {
  body: string | Uint8Array;
  contentType: string;
  fileExtension: string;
}

interface Labels {
  summary: string;
  keyExpertise: string;
  technicalSkills: string;
  experience: string;
  education: string;
  languages: string;
  certifications: string;
  metadata: string;
  profile: string;
  capabilities: string;
  consultantProfile: string;
  contact: string;
  candidate: string;
  email: string;
  phone: string;
  address: string;
  title: string;
  expertise: string;
  contactValue: string;
  clientReady: string;
  notDetected: string;
}

interface Theme {
  accent: string;
  accentRgb: [number, number, number];
  title: string;
  muted: string;
  sectionFill: string;
}

export async function renderOutput(cv: CVData, outputFormat: OutputFormat): Promise<RenderedOutput> {
  if (outputFormat === 'markdown') {
    return {
      body: renderMarkdown(cv),
      contentType: 'text/markdown; charset=utf-8',
      fileExtension: 'md'
    };
  }

  if (outputFormat === 'pdf') {
    return {
      body: await renderPdf(cv),
      contentType: 'application/pdf',
      fileExtension: 'pdf'
    };
  }

  return {
    body: await renderDocx(cv),
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileExtension: 'docx'
  };
}

function renderMarkdown(cv: CVData): string {
  const labels = getLabels(cv.meta.outputLanguage);
  return [
    `# ${cv.fullName}`,
    '',
    `## ${cv.title}`,
    '',
    `## ${labels.summary}`,
    '',
    ...cv.summaryLines.map((line) => `- ${line}`),
    '',
    `## ${labels.keyExpertise}`,
    '',
    ...(cv.keyExpertise.length ? cv.keyExpertise.map((skill) => `- ${skill}`) : [`- ${labels.notDetected}`]),
    '',
    `## ${labels.technicalSkills}`,
    '',
    ...Object.entries(cv.technicalSkills).flatMap(([category, skills]) => [
      `### ${category}`,
      skills.length ? skills.join(', ') : labels.notDetected,
      ''
    ]),
    ...renderMarkdownList(labels.education, cv.education),
    ...renderMarkdownList(labels.languages, cv.languages),
    ...renderMarkdownList(labels.certifications, cv.certifications),
    `## ${labels.metadata}`,
    '',
    `- Provider: ${cv.meta.provider}`,
    `- Model: ${cv.meta.model}`,
    `- Template: ${cv.meta.templateStyle}`,
    `- Language: ${cv.meta.outputLanguage}`,
    `- Source: ${cv.meta.sourceFileName}`,
    `- Processed at: ${cv.meta.processedAt}`
  ].join('\n');
}

async function renderDocx(cv: CVData): Promise<Uint8Array> {
  const zip = new JSZip();
  const documentXml = cv.meta.templateStyle === 'consulting'
    ? buildConsultingDocumentXml(cv)
    : buildDocumentXml(cv);

  zip.file('[Content_Types].xml', contentTypesXml());
  zip.folder('_rels')?.file('.rels', packageRelsXml());
  zip.folder('docProps')?.file('core.xml', corePropsXml(cv));
  zip.folder('docProps')?.file('app.xml', appPropsXml());
  zip.folder('word')?.file('document.xml', documentXml);
  zip.folder('word')?.file('styles.xml', stylesXml());
  zip.folder('word')?.file('settings.xml', settingsXml());
  zip.folder('word')?.file('footer1.xml', footerXml());
  zip.folder('word/media')?.file('braineesys-logo.png', braineeSysLogoPngBytes());
  zip.folder('word/_rels')?.file('document.xml.rels', documentRelsXml());

  return zip.generateAsync({
    type: 'uint8array',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });
}

async function renderPdf(cv: CVData): Promise<Uint8Array> {
  if (cv.meta.templateStyle === 'consulting') {
    return renderConsultingPdf(cv);
  }

  const labels = getLabels(cv.meta.outputLanguage);
  const theme = getTheme(cv.meta.templateStyle);
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let page = pdf.addPage([595, 842]);
  const margin = 48;
  const maxWidth = 595 - margin * 2;
  let y = 790;

  const accent = rgb(theme.accentRgb[0] / 255, theme.accentRgb[1] / 255, theme.accentRgb[2] / 255);
  const ink = rgb(16 / 255, 47 / 255, 58 / 255);
  const muted = rgb(88 / 255, 111 / 255, 121 / 255);

  const ensureSpace = (needed: number): void => {
    if (y - needed > 48) {
      return;
    }
    page = pdf.addPage([595, 842]);
    y = 790;
  };

  const text = (value: string, options: { size?: number; font?: typeof regular; color?: ReturnType<typeof rgb>; leading?: number } = {}): void => {
    const size = options.size || 10;
    const font = options.font || regular;
    const leading = options.leading || size + 5;
    const lines = wrapText(value, font, size, maxWidth);
    ensureSpace(lines.length * leading + 4);
    for (const line of lines) {
      page.drawText(line, { x: margin, y, size, font, color: options.color || ink });
      y -= leading;
    }
  };

  const heading = (value: string): void => {
    ensureSpace(38);
    y -= 12;
    page.drawText(value.toUpperCase(), { x: margin, y, size: 10, font: bold, color: accent });
    y -= 16;
    page.drawLine({ start: { x: margin, y }, end: { x: margin + maxWidth, y }, thickness: 1, color: accent, opacity: 0.35 });
    y -= 14;
  };

  page.drawRectangle({ x: 0, y: 720, width: 595, height: 122, color: accent, opacity: 0.14 });
  page.drawText(cv.fullName || 'CV Standardized', { x: margin, y, size: 28, font: bold, color: ink });
  y -= 34;
  page.drawText(cv.title || 'Consultant', { x: margin, y, size: 14, font: regular, color: muted });
  y -= 34;
  page.drawText(`${cv.meta.templateStyle} · ${cv.meta.outputLanguage} · ${cv.meta.provider}`, { x: margin, y, size: 9, font: bold, color: accent });
  y -= 26;

  heading(labels.summary);
  cv.summaryLines.forEach((line) => text(`• ${line}`));

  heading(labels.keyExpertise);
  text(cv.keyExpertise.length ? cv.keyExpertise.join(' · ') : labels.notDetected, { font: bold });

  heading(labels.technicalSkills);
  for (const [category, skills] of Object.entries(cv.technicalSkills)) {
    text(`${category}: ${skills.length ? skills.join(', ') : labels.notDetected}`);
  }

  if (cv.experiences.length) {
    heading(labels.experience);
    for (const experience of cv.experiences) {
      text(`${experience.title || experience.role || 'Experience'} ${experience.dates ? `(${experience.dates})` : ''}`, { font: bold });
      if (experience.context) text(experience.context);
      experience.achievements.slice(0, 4).forEach((line) => text(`• ${line}`));
    }
  }

  renderPdfList(heading, text, labels.education, cv.education);
  renderPdfList(heading, text, labels.languages, cv.languages);
  renderPdfList(heading, text, labels.certifications, cv.certifications);

  return pdf.save();
}

function buildDocumentXml(cv: CVData): string {
  const labels = getLabels(cv.meta.outputLanguage);
  const theme = getTheme(cv.meta.templateStyle);
  const blocks: string[] = [
    paragraph(cv.fullName || 'CV Standardized', 'Title', theme.title),
    paragraph(cv.title || 'Consultant', 'Subtitle', theme.muted),
    paragraph(`${cv.meta.templateStyle.toUpperCase()} · ${cv.meta.outputLanguage.toUpperCase()} · ${cv.meta.provider.toUpperCase()}`, 'Meta', theme.accent),
    divider(theme.accent),
    heading(labels.summary, theme.accent),
    ...cv.summaryLines.map((line) => bullet(line)),
    heading(labels.keyExpertise, theme.accent),
    paragraph(cv.keyExpertise.length ? cv.keyExpertise.join(' · ') : labels.notDetected, 'BodyStrong'),
    heading(labels.technicalSkills, theme.accent),
    ...Object.entries(cv.technicalSkills).map(([category, skills]) => paragraph(`${category}: ${skills.length ? skills.join(', ') : labels.notDetected}`, 'Body')),
    ...experienceBlocks(cv, labels, theme),
    ...simpleSection(labels.education, cv.education, theme),
    ...simpleSection(labels.languages, cv.languages, theme),
    ...simpleSection(labels.certifications, cv.certifications, theme),
    heading(labels.metadata, theme.accent),
    paragraph(`Provider: ${cv.meta.provider} · Model: ${cv.meta.model}`, 'Small'),
    paragraph(`Source: ${cv.meta.sourceFileName}`, 'Small'),
    paragraph(`Processed at: ${cv.meta.processedAt}`, 'Small')
  ];

  return xml([
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">',
    '<w:body>',
    ...blocks,
    sectionProperties(1080, 1080, 1080, 1080),
    '</w:body>',
    '</w:document>'
  ]);
}

function buildConsultingDocumentXml(cv: CVData): string {
  const labels = getLabels(cv.meta.outputLanguage);
  const theme = getTheme('consulting');
  const contactItems = [
    [`${labels.candidate}:`, cv.fullName || 'Confidential Candidate'],
    [`${labels.title}:`, cv.title || 'Consultant'],
    [`${labels.languages}:`, cv.languages.slice(0, 2).join(', ') || labels.notDetected],
    [`${labels.expertise}:`, cv.keyExpertise.slice(0, 3).join(', ') || labels.notDetected],
    [`${labels.email}:`, cv.contact?.email || labels.contactValue],
    [`${labels.phone}:`, cv.contact?.phone || labels.contactValue],
    [`${labels.address}:`, cv.contact?.address || labels.contactValue]
  ] as const;
  const sidebarBlocks = [
    consultingSmallHeading('Snapshot', theme.accent),
    ...cv.summaryLines.map((line) => consultingBullet(line)),
    consultingSpacer(80),
    consultingSmallHeading(labels.expertise, theme.accent),
    ...cv.keyExpertise.map((skill) => consultingBullet(skill))
  ];
  const bodyBlocks = [
    consultingHeading(labels.profile, theme.accent),
    ...cv.summaryLines.slice(0, 4).map((line) => consultingParagraph(line)),
    consultingHeading(labels.capabilities, theme.accent),
    ...Object.entries(cv.technicalSkills).flatMap(([category, skills]) => (
      skills.length ? [consultingRichParagraph(category, skills.join(', '))] : []
    )),
    ...consultingExperienceBlocks(cv, labels, theme),
    ...consultingSimpleBlocks(labels.education, cv.education, theme),
    ...consultingSimpleBlocks(labels.languages, cv.languages, theme),
    ...consultingSimpleBlocks(labels.certifications, cv.certifications, theme)
  ];

  return xml([
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">',
    '<w:body>',
    consultingTopTable(cv, contactItems, theme),
    consultingSpacer(300),
    consultingSmallHeading(labels.consultantProfile, theme.accent),
    divider(theme.accent),
    consultingTwoColumnTable(sidebarBlocks, bodyBlocks, theme),
    sectionProperties(1000, 1000, 900, 1000),
    '</w:body>',
    '</w:document>'
  ]);
}

function consultingTopTable(cv: CVData, contactItems: readonly (readonly [string, string])[], theme: Theme): string {
  return table([
    tableRow([
      tableCell([
        consultingParagraph(cv.fullName || 'CV Standardized', { style: 'ConsultingTitle', color: theme.title }),
        consultingParagraph(cv.title || 'Consultant', { style: 'ConsultingSubtitle', color: theme.muted }),
        consultingParagraph(getLabels(cv.meta.outputLanguage).clientReady, { style: 'ConsultingBody', color: theme.title })
      ], { width: 5700 }),
      tableCell([
        consultingLogoParagraph(),
        consultingSmallHeading(getLabels(cv.meta.outputLanguage).contact, theme.accent),
        ...contactItems.map(([label, value]) => consultingRichParagraph(label, value, { style: 'ConsultingContact' }))
      ], { width: 3300, shading: 'F6F8FA', margins: 220 })
    ])
  ], { widths: [5700, 3300] });
}

function consultingTwoColumnTable(sidebarBlocks: string[], bodyBlocks: string[], theme: Theme): string {
  return table([
    tableRow([
      tableCell(sidebarBlocks, { width: 2550, shading: theme.sectionFill, margins: 160 }),
      tableCell(bodyBlocks, { width: 6300, margins: 120 })
    ])
  ], { widths: [2550, 6300] });
}

function consultingExperienceBlocks(cv: CVData, labels: Labels, theme: Theme): string[] {
  if (!cv.experiences.length) {
    return [];
  }

  return [
    consultingHeading(labels.experience, theme.accent),
    ...cv.experiences.flatMap((experience) => [
      consultingParagraph(experience.title || experience.role || 'Experience', { style: 'ConsultingStrong', color: theme.title }),
      experience.dates ? consultingParagraph(experience.dates, { style: 'ConsultingSmall', color: theme.muted }) : '',
      experience.context ? consultingParagraph(experience.context) : '',
      ...experience.achievements.slice(0, 6).map((line) => consultingBullet(line))
    ].filter(Boolean))
  ];
}

function consultingSimpleBlocks(title: string, values: string[], theme: Theme): string[] {
  if (!values.length) {
    return [];
  }

  return [
    consultingHeading(title, theme.accent),
    ...values.map((value) => consultingBullet(value))
  ];
}

function consultingLogoParagraph(): string {
  return [
    '<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="160"/></w:pPr>',
    '<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0">',
    '<wp:extent cx="1257300" cy="600000"/>',
    '<wp:docPr id="1" name="BraineeSys logo"/>',
    '<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">',
    '<pic:pic>',
    '<pic:nvPicPr><pic:cNvPr id="1" name="braineesys-logo.png"/><pic:cNvPicPr/></pic:nvPicPr>',
    '<pic:blipFill><a:blip r:embed="rIdBraineeSysLogo"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>',
    '<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="1257300" cy="600000"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>',
    '</pic:pic>',
    '</a:graphicData></a:graphic>',
    '</wp:inline></w:drawing></w:r>',
    '</w:p>'
  ].join('');
}

function consultingHeading(text: string, color: string): string {
  return [
    `<w:p><w:pPr><w:pStyle w:val="ConsultingHeading"/><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="${color}"/></w:pBdr></w:pPr>`,
    `<w:r><w:rPr><w:b/><w:color w:val="${color}"/></w:rPr><w:t>${escapeXml(text.toUpperCase())}</w:t></w:r></w:p>`
  ].join('');
}

function consultingSmallHeading(text: string, color: string): string {
  return `<w:p><w:pPr><w:pStyle w:val="ConsultingSmallHeading"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="${color}"/></w:rPr><w:t>${escapeXml(text.toUpperCase())}</w:t></w:r></w:p>`;
}

function consultingParagraph(text: string, options: { style?: string; color?: string } = {}): string {
  const colorXml = options.color ? `<w:color w:val="${options.color}"/>` : '';
  return `<w:p><w:pPr><w:pStyle w:val="${options.style || 'ConsultingBody'}"/></w:pPr><w:r><w:rPr>${colorXml}</w:rPr><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`;
}

function consultingRichParagraph(label: string, value: string, options: { style?: string } = {}): string {
  return [
    `<w:p><w:pPr><w:pStyle w:val="${options.style || 'ConsultingBody'}"/></w:pPr>`,
    `<w:r><w:rPr><w:b/></w:rPr><w:t xml:space="preserve">${escapeXml(label)} </w:t></w:r>`,
    `<w:r><w:t xml:space="preserve">${escapeXml(value)}</w:t></w:r>`,
    '</w:p>'
  ].join('');
}

function consultingBullet(text: string): string {
  return [
    '<w:p><w:pPr><w:pStyle w:val="ConsultingBullet"/><w:ind w:left="260" w:hanging="160"/></w:pPr>',
    `<w:r><w:t xml:space="preserve">• ${escapeXml(text)}</w:t></w:r></w:p>`
  ].join('');
}

function consultingSpacer(height: number): string {
  return `<w:p><w:pPr><w:spacing w:after="${height}"/></w:pPr></w:p>`;
}

function table(rows: string[], options: { widths: number[] }): string {
  return [
    '<w:tbl>',
    '<w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders></w:tblPr>',
    `<w:tblGrid>${options.widths.map((width) => `<w:gridCol w:w="${width}"/>`).join('')}</w:tblGrid>`,
    ...rows,
    '</w:tbl>'
  ].join('');
}

function tableRow(cells: string[]): string {
  return `<w:tr>${cells.join('')}</w:tr>`;
}

function tableCell(blocks: string[], options: { width: number; shading?: string; margins?: number }): string {
  const margin = options.margins ?? 0;
  const shading = options.shading ? `<w:shd w:fill="${options.shading}"/>` : '';
  return [
    '<w:tc>',
    '<w:tcPr>',
    `<w:tcW w:w="${options.width}" w:type="dxa"/>`,
    shading,
    `<w:tcMar><w:top w:w="${margin}" w:type="dxa"/><w:left w:w="${margin}" w:type="dxa"/><w:bottom w:w="${margin}" w:type="dxa"/><w:right w:w="${margin}" w:type="dxa"/></w:tcMar>`,
    '</w:tcPr>',
    ...blocks,
    '</w:tc>'
  ].join('');
}

function experienceBlocks(cv: CVData, labels: Labels, theme: Theme): string[] {
  if (!cv.experiences.length) {
    return [];
  }

  return [
    heading(labels.experience, theme.accent),
    ...cv.experiences.flatMap((experience) => [
      paragraph(`${experience.title || experience.role || 'Experience'}${experience.dates ? ` · ${experience.dates}` : ''}`, 'BodyStrong', theme.title),
      experience.context ? paragraph(experience.context, 'Body') : '',
      ...experience.achievements.slice(0, 5).map((line) => bullet(line)),
      ...experience.results.slice(0, 3).map((line) => bullet(line))
    ].filter(Boolean))
  ];
}

function simpleSection(title: string, values: string[], theme: Theme): string[] {
  if (!values.length) {
    return [];
  }

  return [heading(title, theme.accent), ...values.map((value) => bullet(value))];
}

function paragraph(text: string, style = 'Body', color?: string): string {
  const colorXml = color ? `<w:color w:val="${color}"/>` : '';
  return `<w:p><w:pPr><w:pStyle w:val="${style}"/></w:pPr><w:r><w:rPr>${colorXml}</w:rPr><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`;
}

function heading(text: string, color: string): string {
  return `<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="${color}"/></w:rPr><w:t>${escapeXml(text.toUpperCase())}</w:t></w:r></w:p>`;
}

function bullet(text: string): string {
  return `<w:p><w:pPr><w:pStyle w:val="Bullet"/></w:pPr><w:r><w:t xml:space="preserve">• ${escapeXml(text)}</w:t></w:r></w:p>`;
}

function divider(color: string): string {
  return `<w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="8" w:space="1" w:color="${color}"/></w:pBdr><w:spacing w:after="220"/></w:pPr></w:p>`;
}

function stylesXml(): string {
  return xml([
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">',
    style('Normal', 'Normal', 20, '102F3A', false, 140),
    style('Body', 'Body', 20, '102F3A', false, 120),
    style('BodyStrong', 'Body Strong', 21, '102F3A', true, 120),
    style('Title', 'Title', 44, '102F3A', true, 180),
    style('Subtitle', 'Subtitle', 24, '5D7480', false, 220),
    style('Meta', 'Meta', 16, '0C9A9A', true, 160),
    style('Heading1', 'Heading 1', 18, '0C9A9A', true, 100),
    style('Small', 'Small', 16, '5D7480', false, 80),
    style('Bullet', 'Bullet', 19, '102F3A', false, 80),
    style('ConsultingTitle', 'Consulting Title', 48, '10192D', true, 160),
    style('ConsultingSubtitle', 'Consulting Subtitle', 26, '3F4D62', false, 120),
    style('ConsultingBody', 'Consulting Body', 21, '10192D', false, 110),
    style('ConsultingStrong', 'Consulting Strong', 22, '10192D', true, 70),
    style('ConsultingHeading', 'Consulting Heading', 25, '007569', true, 100),
    style('ConsultingSmallHeading', 'Consulting Small Heading', 20, '007569', true, 80),
    style('ConsultingSmall', 'Consulting Small', 18, '3F4D62', false, 70),
    style('ConsultingContact', 'Consulting Contact', 19, '10192D', false, 85),
    style('ConsultingBullet', 'Consulting Bullet', 20, '10192D', false, 85),
    '</w:styles>'
  ]);
}

function style(id: string, name: string, size: number, color: string, bold: boolean, after: number): string {
  return [
    `<w:style w:type="paragraph" w:styleId="${id}">`,
    `<w:name w:val="${name}"/>`,
    '<w:qFormat/>',
    '<w:pPr>',
    `<w:spacing w:after="${after}" w:line="276" w:lineRule="auto"/>`,
    '</w:pPr>',
    '<w:rPr>',
    '<w:rFonts w:ascii="Aptos" w:hAnsi="Aptos"/>',
    bold ? '<w:b/>' : '',
    `<w:color w:val="${color}"/>`,
    `<w:sz w:val="${size}"/>`,
    '</w:rPr>',
    '</w:style>'
  ].join('');
}

function contentTypesXml(): string {
  return xml([
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>',
    '<Default Extension="xml" ContentType="application/xml"/>',
    '<Default Extension="png" ContentType="image/png"/>',
    '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>',
    '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>',
    '<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>',
    '<Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>',
    '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>',
    '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>',
    '</Types>'
  ]);
}

function packageRelsXml(): string {
  return xml([
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>',
    '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>',
    '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>',
    '</Relationships>'
  ]);
}

function documentRelsXml(): string {
  return xml([
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
    '<Relationship Id="rIdBraineeSysLogo" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/braineesys-logo.png"/>',
    '<Relationship Id="rIdFooter1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>',
    '</Relationships>'
  ]);
}

function footerXml(): string {
  return xml([
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">',
    '<w:p><w:pPr><w:jc w:val="center"/><w:pStyle w:val="Small"/></w:pPr>',
    '<w:r><w:t xml:space="preserve">Page </w:t></w:r>',
    '<w:r><w:fldChar w:fldCharType="begin"/></w:r>',
    '<w:r><w:instrText xml:space="preserve">PAGE</w:instrText></w:r>',
    '<w:r><w:fldChar w:fldCharType="separate"/></w:r>',
    '<w:r><w:t>1</w:t></w:r>',
    '<w:r><w:fldChar w:fldCharType="end"/></w:r>',
    '</w:p>',
    '</w:ftr>'
  ]);
}

function sectionProperties(top: number, right: number, bottom: number, left: number): string {
  return [
    '<w:sectPr>',
    '<w:footerReference w:type="default" r:id="rIdFooter1"/>',
    '<w:pgSz w:w="11906" w:h="16838"/>',
    `<w:pgMar w:top="${top}" w:right="${right}" w:bottom="${bottom}" w:left="${left}" w:header="720" w:footer="720" w:gutter="0"/>`,
    '</w:sectPr>'
  ].join('');
}

function corePropsXml(cv: CVData): string {
  return xml([
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',
    `<dc:title>${escapeXml(cv.fullName)} - CV Standardized</dc:title>`,
    '<dc:creator>CV Standardizer</dc:creator>',
    `<dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:created>`,
    `<dcterms:modified xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:modified>`,
    '</cp:coreProperties>'
  ]);
}

function appPropsXml(): string {
  return xml([
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">',
    '<Application>CV Standardizer</Application>',
    '</Properties>'
  ]);
}

function settingsXml(): string {
  return xml([
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:zoom w:percent="100"/></w:settings>'
  ]);
}

function renderMarkdownList(title: string, values: string[]): string[] {
  return values.length ? [`## ${title}`, '', ...values.map((value) => `- ${value}`), ''] : [];
}

function renderPdfList(heading: (value: string) => void, text: (value: string) => void, title: string, values: string[]): void {
  if (!values.length) {
    return;
  }
  heading(title);
  values.forEach((value) => text(`• ${value}`));
}

async function renderConsultingPdf(cv: CVData): Promise<Uint8Array> {
  const labels = getLabels(cv.meta.outputLanguage);
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.TimesRoman);
  const bold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const italic = await pdf.embedFont(StandardFonts.TimesRomanItalic);
  const logoImage = await pdf.embedPng(braineeSysLogoPngBytes());
  const accent = rgb(0 / 255, 117 / 255, 105 / 255);
  const ink = rgb(16 / 255, 25 / 255, 45 / 255);
  const muted = rgb(63 / 255, 77 / 255, 98 / 255);
  const panel = rgb(246 / 255, 248 / 255, 250 / 255);

  let page = pdf.addPage([595.2, 841.92]);
  let pageNumber = 1;
  let y = 790;
  const margin = 54;
  const contentBottom = 48;
  const bodyX = 214;
  const sideX = margin;
  const sideWidth = 132;
  const bodyWidth = 327;
  const sidebarLines = buildPdfSidebarLines(cv, labels, regular, sideWidth - 34);
  let sidebarCursor = 0;

  const drawSidebarFlow = (topY: number): void => {
    sidebarCursor = drawSidebarPage(page, sidebarLines, sidebarCursor, {
      x: sideX,
      topY,
      bottomY: contentBottom,
      width: sideWidth,
      regular,
      bold,
      accent,
      ink,
      panel
    });
  };

  const newPage = (): void => {
    drawFooter(page, pageNumber, regular, muted);
    page = pdf.addPage([595.2, 841.92]);
    pageNumber += 1;
    y = 790;
    drawSidebarFlow(790);
  };

  const ensureSpace = (needed: number): void => {
    if (y - needed < contentBottom) {
      newPage();
    }
  };

  const drawText = (
    value: string,
    x: number,
    currentY: number,
    options: { size?: number; font?: PDFFont; color?: RGB; maxWidth?: number; leading?: number } = {}
  ): number => {
    const size = options.size || 10.5;
    const font = options.font || regular;
    const color = options.color || ink;
    const leading = options.leading || size + 4;
    const lines = wrapText(value, font, size, options.maxWidth || bodyWidth);
    for (const line of lines) {
      page.drawText(line, { x, y: currentY, size, font, color });
      currentY -= leading;
    }
    return currentY;
  };

  const sectionTitle = (title: string): void => {
    ensureSpace(34);
    y -= 10;
    page.drawText(title.toUpperCase(), { x: bodyX, y, size: 13, font: bold, color: accent });
    page.drawLine({ start: { x: bodyX, y: y - 5 }, end: { x: bodyX + bodyWidth, y: y - 5 }, thickness: 0.8, color: accent });
    y -= 22;
  };

  const bodyParagraph = (value: string, options: { font?: PDFFont; size?: number; leading?: number } = {}): void => {
    const size = options.size || 10.5;
    const lines = wrapText(value, options.font || regular, size, bodyWidth);
    ensureSpace(lines.length * (options.leading || size + 4) + 6);
    y = drawText(value, bodyX, y, { maxWidth: bodyWidth, font: options.font, size, leading: options.leading });
    y -= 3;
  };

  drawConsultingHeader(page, cv, { regular, bold, italic, accent, ink, muted, panel, logoImage });
  y = 520;
  page.drawText('CONSULTANT PROFILE', { x: margin, y: 558, size: 10.5, font: bold, color: accent });
  page.drawLine({ start: { x: margin, y: 538 }, end: { x: 541, y: 538 }, thickness: 1.1, color: accent });

  drawSidebarFlow(506);

  sectionTitle('Profile');
  for (const line of cv.summaryLines.slice(0, 4)) {
    bodyParagraph(line, { size: 10.8, leading: 14.2 });
  }

  sectionTitle('Capabilities');
  for (const [category, skills] of Object.entries(cv.technicalSkills)) {
    if (!skills.length) {
      continue;
    }
    const prefix = `${category}: `;
    const value = `${prefix}${skills.join(', ')}`;
    ensureSpace(wrapText(value, regular, 10.2, bodyWidth).length * 14 + 4);
    page.drawText(prefix, { x: bodyX, y, size: 10.2, font: bold, color: ink });
    y = drawText(value.slice(prefix.length), bodyX + bold.widthOfTextAtSize(prefix, 10.2), y, {
      size: 10.2,
      font: regular,
      color: ink,
      maxWidth: bodyWidth - bold.widthOfTextAtSize(prefix, 10.2),
      leading: 13.8
    });
    y -= 2;
  }

  if (cv.experiences.length) {
    sectionTitle(labels.experience);
    for (const experience of cv.experiences) {
      ensureSpace(58);
      const title = experience.title || experience.role || 'Experience';
      page.drawText(title, { x: bodyX, y, size: 11, font: bold, color: ink });
      if (experience.dates) {
        page.drawText(experience.dates, {
          x: bodyX,
          y: y - 14,
          size: 9.4,
          font: italic,
          color: muted
        });
        y -= 29;
      } else {
        y -= 16;
      }
      if (experience.context) {
        bodyParagraph(experience.context, { size: 10, leading: 13.2 });
      }
      for (const achievement of experience.achievements.slice(0, 5)) {
        const bulletText = `• ${achievement}`;
        const lines = wrapText(bulletText, regular, 9.8, bodyWidth - 8);
        ensureSpace(lines.length * 13.2 + 3);
        y = drawText(bulletText, bodyX + 8, y, { size: 9.8, maxWidth: bodyWidth - 8, leading: 13.2 });
      }
      y -= 8;
    }
  }

  drawSimplePdfSection(sectionTitle, bodyParagraph, labels.education, cv.education);
  drawSimplePdfSection(sectionTitle, bodyParagraph, labels.languages, cv.languages);
  drawSimplePdfSection(sectionTitle, bodyParagraph, labels.certifications, cv.certifications);

  while (sidebarCursor < sidebarLines.length) {
    newPage();
  }

  drawFooter(page, pageNumber, regular, muted);

  return pdf.save();
}

function drawConsultingHeader(
  page: PDFPage,
  cv: CVData,
  fonts: { regular: PDFFont; bold: PDFFont; italic: PDFFont; accent: RGB; ink: RGB; muted: RGB; panel: RGB; logoImage: PDFImage }
): void {
  const { regular, bold, italic, accent, ink, muted, panel, logoImage } = fonts;
  page.drawText(cv.fullName || 'CV Standardized', { x: 54, y: 744, size: 22, font: bold, color: ink });
  page.drawText(cv.title || 'Consultant', { x: 54, y: 714, size: 13.5, font: regular, color: muted });
  page.drawText('Client-ready profile prepared for presentation and interview', { x: 54, y: 688, size: 10.6, font: regular, color: ink });
  page.drawText('shortlisting.', { x: 54, y: 674, size: 10.6, font: regular, color: ink });

  page.drawRectangle({ x: 350, y: 566, width: 180, height: 226, color: panel });
  page.drawImage(logoImage, { x: 393, y: 739, width: 92, height: 44 });
  page.drawText('CONTACT', { x: 360, y: 720, size: 10.5, font: bold, color: accent });
  let contactY = 699;
  contactY = drawContactLine(page, 'Candidate:', cv.fullName || 'Confidential Candidate', 360, contactY, 158, { regular, bold, ink });
  contactY = drawContactLine(page, 'Title:', cv.title || 'Consultant', 360, contactY - 5, 158, { regular, bold, ink });
  contactY = drawContactLine(page, 'Languages:', cv.languages.slice(0, 2).join(', ') || 'Shared on request', 360, contactY - 5, 158, { regular, bold, ink });
  contactY = drawContactLine(page, 'Email:', cv.contact?.email || 'Shared on request', 360, contactY - 5, 158, { regular, bold, ink });
  contactY = drawContactLine(page, 'Phone:', cv.contact?.phone || 'Shared on request', 360, contactY - 5, 158, { regular, bold, ink });
  drawContactLine(page, 'Address:', cv.contact?.address || 'Shared on request', 360, contactY - 5, 158, { regular, bold, ink });
}

function drawContactLine(
  page: PDFPage,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number,
  fonts: { regular: PDFFont; bold: PDFFont; ink: RGB }
): number {
  const size = 9.7;
  page.drawText(label, { x, y, size, font: fonts.bold, color: fonts.ink });
  const labelWidth = fonts.bold.widthOfTextAtSize(label, size) + 4;
  const lines = wrapText(value, fonts.regular, size, width - labelWidth);
  let lineY = y;
  for (const [index, line] of lines.slice(0, 3).entries()) {
    page.drawText(line, { x: index === 0 ? x + labelWidth : x, y: lineY, size, font: fonts.regular, color: fonts.ink });
    lineY -= 12;
  }
  return lineY;
}

type PdfSidebarLine =
  | { kind: 'heading'; text: string }
  | { kind: 'bullet'; text: string; firstLine: boolean };

function buildPdfSidebarLines(cv: CVData, labels: Labels, regular: PDFFont, textWidth: number): PdfSidebarLine[] {
  const lines: PdfSidebarLine[] = [{ kind: 'heading', text: 'Snapshot' }];
  const snapshot = cv.summaryLines.length ? cv.summaryLines : [labels.notDetected];
  for (const item of snapshot) {
    for (const [index, line] of wrapText(item, regular, 9.7, textWidth).entries()) {
      lines.push({ kind: 'bullet', text: line, firstLine: index === 0 });
    }
  }

  lines.push({ kind: 'heading', text: labels.expertise });
  const expertise = cv.keyExpertise.length ? cv.keyExpertise : [labels.notDetected];
  for (const item of expertise) {
    for (const [index, line] of wrapText(item, regular, 9.7, textWidth).entries()) {
      lines.push({ kind: 'bullet', text: line, firstLine: index === 0 });
    }
  }

  return lines;
}

function drawSidebarPage(
  page: PDFPage,
  lines: PdfSidebarLine[],
  startIndex: number,
  options: { x: number; topY: number; bottomY: number; width: number; regular: PDFFont; bold: PDFFont; accent: RGB; ink: RGB; panel: RGB }
): number {
  const { x, topY, bottomY, width, regular, bold, accent, ink, panel } = options;
  let y = topY - 14;
  let index = startIndex;
  page.drawRectangle({ x, y: bottomY - 2, width, height: topY - bottomY + 12, color: panel });

  while (index < lines.length) {
    const line = lines[index];
    const needed = line.kind === 'heading' ? 24 : line.firstLine ? 17 : 13.4;
    if (y - needed < bottomY) {
      break;
    }

    if (line.kind === 'heading') {
      if (index > 0) {
        y -= 6;
      }
      page.drawText(line.text.toUpperCase(), { x: x + 8, y, size: 10.3, font: bold, color: accent });
      y -= 18;
      index += 1;
      continue;
    }

    if (line.firstLine) {
      page.drawText('-', { x: x + 24, y, size: 12, font: bold, color: ink });
    }
    page.drawText(line.text, { x: x + 42, y, size: 9.7, font: regular, color: ink });
    y -= 13.4;
    const nextLine = lines[index + 1];
    if (!nextLine || nextLine.kind !== 'bullet' || nextLine.firstLine) {
      y -= 4;
    }
    index += 1;
  }

  return index;
}

function drawSimplePdfSection(
  sectionTitle: (title: string) => void,
  bodyParagraph: (value: string, options?: { font?: PDFFont; size?: number; leading?: number }) => void,
  title: string,
  values: string[]
): void {
  if (!values.length) {
    return;
  }
  sectionTitle(title);
  values.forEach((value) => bodyParagraph(`• ${value}`, { size: 10, leading: 13.5 }));
}

function drawFooter(page: PDFPage, pageNumber: number, font: PDFFont, color: RGB): void {
  const label = `Page ${pageNumber}`;
  const size = 8;
  page.drawText(label, { x: (page.getWidth() - font.widthOfTextAtSize(label, size)) / 2, y: 28, size, font, color });
}

function getLabels(language: OutputLanguage): Labels {
  if (language === 'fr') {
    return {
      summary: 'Synthèse',
      keyExpertise: 'Expertises clés',
      technicalSkills: 'Compétences techniques',
      experience: 'Expérience professionnelle',
      education: 'Formation',
      languages: 'Langues',
      certifications: 'Certifications',
      metadata: 'Métadonnées',
      profile: 'Profil',
      capabilities: 'Compétences',
      consultantProfile: 'Profil Consultant',
      contact: 'Contact',
      candidate: 'Candidat',
      email: 'Email',
      phone: 'Téléphone',
      address: 'Adresse',
      title: 'Titre',
      expertise: 'Expertise',
      contactValue: 'Partagé par BraineeSys sur demande',
      clientReady: 'Profil prêt pour présentation client et présélection entretien.',
      notDetected: 'Non détecté'
    };
  }

  return {
    summary: 'Executive Summary',
    keyExpertise: 'Key Expertise',
    technicalSkills: 'Technical Skills',
    experience: 'Professional Experience',
    education: 'Education',
    languages: 'Languages',
    certifications: 'Certifications',
    metadata: 'Metadata',
    profile: 'Profile',
    capabilities: 'Capabilities',
    consultantProfile: 'Consultant Profile',
    contact: 'Contact',
    candidate: 'Candidate',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    title: 'Title',
    expertise: 'Expertise',
    contactValue: 'Shared through BraineeSys on request',
    clientReady: 'Client-ready profile prepared for presentation and interview shortlisting.',
    notDetected: 'Not detected yet'
  };
}

function getTheme(templateStyle: TemplateStyle): Theme {
  if (templateStyle === 'modern') {
    return { accent: '2563EB', accentRgb: [37, 99, 235], title: '0F172A', muted: '475569', sectionFill: 'EFF6FF' };
  }

  if (templateStyle === 'consulting') {
    return { accent: '0C9A9A', accentRgb: [12, 154, 154], title: '102F3A', muted: '5D7480', sectionFill: 'E8FAFA' };
  }

  return { accent: '334155', accentRgb: [51, 65, 85], title: '111827', muted: '6B7280', sectionFill: 'F8FAFC' };
}

function wrapText(value: string, font: { widthOfTextAtSize(text: string, size: number): number }, size: number, maxWidth: number): string[] {
  const words = normalizePdfText(value).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines.length ? lines : [''];
}

function normalizePdfText(value: string): string {
  return value
    .replace(/[→⇒➜]/g, '->')
    .replace(/[←⇐]/g, '<-')
    .replace(/[•●]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/[…]/g, '...')
    .replace(/[^\x09\x0a\x0d\x20-\x7eÀ-ÿ€]/g, ' ');
}

function xml(parts: string[]): string {
  return parts.join('');
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
