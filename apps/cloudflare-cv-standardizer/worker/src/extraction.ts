export async function extractTextFromObject(object: R2ObjectBody, fileName: string): Promise<string> {
  const lowerName = fileName.toLowerCase();

  if (lowerName.endsWith('.txt') || object.httpMetadata?.contentType?.startsWith('text/')) {
    return object.text();
  }

  const bytes = new Uint8Array(await object.arrayBuffer());
  const decoded = bestEffortDecode(bytes);

  if (lowerName.endsWith('.pdf')) {
    return cleanupText(decoded)
      || `PDF text extraction is limited in the Cloudflare Worker preview. Source file: ${fileName}`;
  }

  if (lowerName.endsWith('.docx')) {
    return cleanupText(decoded)
      || `DOCX text extraction is limited in the Cloudflare Worker preview. Source file: ${fileName}`;
  }

  return cleanupText(decoded) || `Unsupported binary file preview. Source file: ${fileName}`;
}

function bestEffortDecode(bytes: Uint8Array): string {
  const decoder = new TextDecoder('utf-8', { fatal: false });
  return decoder.decode(bytes);
}

function cleanupText(value: string): string {
  return value
    .replace(/[^\S\r\n]+/g, ' ')
    .replace(/[^\x09\x0a\x0d\x20-\x7eÀ-ÿ€•–—]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, 18000);
}
