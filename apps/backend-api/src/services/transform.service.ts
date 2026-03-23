import type { CVData, OutputFormat, OutputLanguage, Provider } from '@cv-standardizer/shared-contracts';
import { callOllama } from './providers/ollama.provider';
import { callOpenAI } from './providers/openai.provider';

interface TransformOptions {
  provider: Provider;
  model: string;
  providerBaseUrl?: string;
  apiKey?: string;
  sourceFileName: string;
  outputFormat: OutputFormat;
  outputLanguage: OutputLanguage;
}

export async function transformCv(inputText: string, options: TransformOptions): Promise<CVData> {
  if (options.provider === 'ollama') {
    return callOllama(inputText, options);
  }

  if (options.provider === 'openai') {
    return callOpenAI(inputText, options);
  }

  return {
    schemaVersion: '1.0',
    fullName: '',
    title: 'Consultant / Expert',
    summaryLines: buildHeuristicSummary(inputText),
    keyExpertise: [],
    technicalSkills: {},
    experiences: [],
    education: [],
    languages: [],
    certifications: [],
    rawSections: {
      fullText: inputText
    },
    meta: {
      provider: 'heuristic',
      model: options.model,
      sourceFileName: options.sourceFileName,
      outputFormat: options.outputFormat,
      outputLanguage: options.outputLanguage,
      processedAt: new Date().toISOString()
    }
  };
}

function buildHeuristicSummary(inputText: string): string[] {
  return inputText
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 6);
}
