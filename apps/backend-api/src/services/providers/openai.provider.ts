import OpenAI from 'openai';
import type { CVData, OutputFormat } from '@cv-standardizer/shared-contracts';

interface OpenAIOptions {
  model: string;
  apiKey?: string;
  sourceFileName: string;
  outputFormat: OutputFormat;
}

export async function callOpenAI(inputText: string, options: OpenAIOptions): Promise<CVData> {
  const apiKey = options.apiKey || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OpenAI API key');
  }

  const client = new OpenAI({ apiKey });
  const response = await client.responses.create({
    model: options.model,
    input: buildPrompt(inputText)
  });

  const cv = JSON.parse(response.output_text) as CVData;
  cv.meta = {
    provider: 'openai',
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
    '    "provider": "openai",',
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
