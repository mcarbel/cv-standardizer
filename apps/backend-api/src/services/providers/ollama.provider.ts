import type { CVData, OutputFormat } from '@cv-standardizer/shared-contracts';

interface OllamaOptions {
  model: string;
  providerBaseUrl?: string;
  sourceFileName: string;
  outputFormat: OutputFormat;
}

export async function callOllama(inputText: string, options: OllamaOptions): Promise<CVData> {
  const baseUrl = (options.providerBaseUrl || process.env.DEFAULT_OLLAMA_BASE_URL || 'http://localhost:11434').replace(/\/$/, '');
  const response = await fetch(`${baseUrl}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: options.model,
      prompt: buildPrompt(inputText),
      stream: false,
      format: 'json'
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as { response?: string };
  if (!payload.response) {
    throw new Error('Ollama returned an empty response');
  }

  const cv = JSON.parse(payload.response) as CVData;
  cv.meta = {
    provider: 'ollama',
    model: options.model,
    sourceFileName: options.sourceFileName,
    outputFormat: options.outputFormat,
    processedAt: new Date().toISOString()
  };

  return cv;
}

function buildPrompt(text: string): string {
  return [
    'Return valid JSON only.',
    'Use this exact schema:',
    '{',
    '  "schemaVersion": "1.0",',
    '  "fullName": "string",',
    '  "title": "string",',
    '  "summaryLines": ["string"],',
    '  "keyExpertise": ["string"],',
    '  "technicalSkills": { "Category": ["string"] },',
    '  "experiences": [',
    '    {',
    '      "title": "string",',
    '      "sector": "string",',
    '      "role": "string",',
    '      "context": "string",',
    '      "achievements": ["string"],',
    '      "results": ["string"],',
    '      "dates": "string"',
    '    }',
    '  ],',
    '  "education": ["string"],',
    '  "languages": ["string"],',
    '  "certifications": ["string"],',
    '  "rawSections": { "section": "string" },',
    '  "meta": {',
    '    "provider": "ollama",',
    '    "model": "string",',
    '    "sourceFileName": "string",',
    '    "outputFormat": "docx | pdf | markdown",',
    '    "processedAt": "ISO date string"',
    '  }',
    '}',
    'Do not wrap the JSON in markdown fences.',
    '',
    text
  ].join('\n');
}
