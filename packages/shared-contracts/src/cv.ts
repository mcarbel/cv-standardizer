export type Provider = 'heuristic' | 'openai' | 'ollama';
export type OutputFormat = 'docx' | 'pdf' | 'markdown';

export interface Experience {
  title: string;
  sector: string;
  role: string;
  context: string;
  achievements: string[];
  results: string[];
  dates: string;
}

export interface CVData {
  schemaVersion: string;
  fullName: string;
  title: string;
  summaryLines: string[];
  keyExpertise: string[];
  technicalSkills: Record<string, string[]>;
  experiences: Experience[];
  education: string[];
  languages: string[];
  certifications: string[];
  rawSections: Record<string, string>;
  meta: {
    provider: Provider;
    model: string;
    sourceFileName: string;
    outputFormat: OutputFormat;
    processedAt: string;
  };
}
