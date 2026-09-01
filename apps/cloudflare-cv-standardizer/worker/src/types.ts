export type Provider = 'heuristic' | 'openai' | 'ollama';
export type OutputFormat = 'docx' | 'pdf' | 'markdown';
export type OutputLanguage = 'en' | 'fr' | 'de' | 'es' | 'it';
export type TemplateStyle = 'standard' | 'modern' | 'consulting';
export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface Env {
  DB: D1Database;
  CV_FILES: R2Bucket;
  CV_JOBS_QUEUE?: Queue<JobQueueMessage>;
  DEFAULT_PROVIDER: string;
  DEFAULT_MODEL: string;
  OLLAMA_BASE_URL: string;
  CORS_ORIGIN: string;
  OPENAI_API_KEY?: string;
}

export interface CreateJobOptions {
  provider: Provider;
  model: string;
  outputFormat: OutputFormat;
  outputLanguage: OutputLanguage;
  templateStyle: TemplateStyle;
  anonymizeCandidateName: boolean;
  providerBaseUrl?: string;
  apiKey?: string;
  dumpJson: boolean;
}

export interface JobQueueMessage {
  jobId: string;
  providerBaseUrl?: string;
  apiKey?: string;
  extractedTextObjectKey?: string;
}

export interface JobRecord {
  jobId: string;
  status: JobStatus;
  provider: Provider;
  model: string;
  inputFileName: string;
  inputObjectKey: string;
  outputFormat: OutputFormat;
  outputLanguage: OutputLanguage;
  templateStyle: TemplateStyle;
  anonymizeCandidateName: boolean;
  progress: number;
  errorMessage?: string;
  outputObjectKey: string;
  jsonObjectKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicJobRecord {
  jobId: string;
  status: JobStatus;
  provider: Provider;
  model: string;
  inputFileName: string;
  outputFormat: OutputFormat;
  outputLanguage: OutputLanguage;
  templateStyle: TemplateStyle;
  progress: number;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
  outputDownloadUrl?: string;
  jsonDownloadUrl?: string;
}

export interface CVData {
  schemaVersion: string;
  fullName: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  title: string;
  summaryLines: string[];
  keyExpertise: string[];
  technicalSkills: Record<string, string[]>;
  experiences: Array<{
    title: string;
    sector: string;
    role: string;
    context: string;
    achievements: string[];
    results: string[];
    dates: string;
  }>;
  education: string[];
  languages: string[];
  certifications: string[];
  rawSections: Record<string, string>;
  meta: {
    provider: Provider;
    model: string;
    sourceFileName: string;
    outputFormat: OutputFormat;
    outputLanguage: OutputLanguage;
    templateStyle: TemplateStyle;
    anonymized: boolean;
    processedAt: string;
  };
}
