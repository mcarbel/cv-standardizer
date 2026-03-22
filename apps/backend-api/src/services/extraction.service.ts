import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

export async function extractText(fileName: string, buffer: Buffer): Promise<string> {
  const ext = fileName.toLowerCase().split('.').pop() || '';

  if (ext === 'txt') {
    return buffer.toString('utf-8');
  }

  if (ext === 'pdf') {
    const parsed = await pdfParse(buffer);
    return cleanExtractedText(parsed.text);
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
