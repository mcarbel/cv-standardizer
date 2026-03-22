import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

export async function extractText(fileName: string, buffer: Buffer): Promise<string> {
  const ext = fileName.toLowerCase().split('.').pop() || '';

  if (ext === 'txt') {
    return buffer.toString('utf-8');
  }

  if (ext === 'pdf') {
    return extractPdfText(buffer);
  }

  if (ext === 'docx') {
    const parsed = await mammoth.extractRawText({ buffer });
    return cleanExtractedText(parsed.value);
  }

  throw new Error(`Unsupported file extension: .${ext}`);
}

function cleanExtractedText(value: string): string {
  return value.replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim();
}

async function extractPdfText(buffer: Buffer): Promise<string> {
  console.log(`[extract] pdf start size=${buffer.length}`);

  try {
    const parsed = await withTimeout(pdfParse(buffer), 12000, 'pdf-parse timed out');
    const cleaned = cleanExtractedText(parsed.text || '');
    console.log(`[extract] pdf-parse success length=${cleaned.length}`);

    if (cleaned.length > 40) {
      return cleaned;
    }

    console.warn('[extract] pdf-parse returned too little text, falling back to raw PDF extraction');
  } catch (error) {
    console.warn('[extract] pdf-parse failed, falling back to raw PDF extraction:', error);
  }

  const fallback = cleanExtractedText(extractTextFromPdfStreams(buffer));
  console.log(`[extract] raw pdf fallback length=${fallback.length}`);

  if (fallback.length === 0) {
    throw new Error('Unable to extract readable text from PDF');
  }

  return fallback;
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  return await Promise.race([
    promise,
    new Promise<T>((_resolve, reject) => {
      setTimeout(() => reject(new Error(message)), timeoutMs);
    })
  ]);
}

function extractTextFromPdfStreams(buffer: Buffer): string {
  const raw = buffer.toString('latin1');
  const textSections: string[] = [];
  const sectionRegex = /BT([\s\S]*?)ET/g;

  let sectionMatch: RegExpExecArray | null;
  while ((sectionMatch = sectionRegex.exec(raw)) !== null) {
    const section = sectionMatch[1];
    const lineParts: string[] = [];

    const textRegex = /\((?:\\.|[^\\()])*\)\s*Tj|\[(?:[\s\S]*?)\]\s*TJ/g;
    let textMatch: RegExpExecArray | null;

    while ((textMatch = textRegex.exec(section)) !== null) {
      lineParts.push(decodePdfTextToken(textMatch[0]));
    }

    const line = lineParts.join(' ').replace(/\s+/g, ' ').trim();
    if (line) {
      textSections.push(line);
    }
  }

  return textSections.join('\n');
}

function decodePdfTextToken(token: string): string {
  if (token.trim().endsWith('Tj')) {
    const match = token.match(/\(((?:\\.|[^\\()])*)\)\s*Tj$/);
    return match ? decodePdfEscapes(match[1]) : '';
  }

  const tjMatch = token.match(/\[(.*)\]\s*TJ$/s);
  if (!tjMatch) {
    return '';
  }

  const parts: string[] = [];
  const inner = tjMatch[1];
  const stringRegex = /\(((?:\\.|[^\\()])*)\)/g;
  let stringMatch: RegExpExecArray | null;

  while ((stringMatch = stringRegex.exec(inner)) !== null) {
    parts.push(decodePdfEscapes(stringMatch[1]));
  }

  return parts.join('');
}

function decodePdfEscapes(value: string): string {
  return value
    .replace(/\\\\/g, '\\')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\([0-7]{1,3})/g, (_match, octal: string) => String.fromCharCode(parseInt(octal, 8)));
}
