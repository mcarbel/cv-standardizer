import type { OutputFormat, Provider } from './cv';

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface CreateJobRequestFields {
  provider: Provider;
  model: string;
  outputFormat: OutputFormat;
  providerBaseUrl?: string;
  apiKey?: string;
  dumpJson?: boolean;
}

export interface CreateJobResponse {
  jobId: string;
  status: JobStatus;
}

export interface JobRecord {
  jobId: string;
  status: JobStatus;
  provider: Provider;
  model: string;
  inputFileName: string;
  outputFormat: OutputFormat;
  progress: number;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
  outputDownloadUrl?: string;
  jsonDownloadUrl?: string;
}
