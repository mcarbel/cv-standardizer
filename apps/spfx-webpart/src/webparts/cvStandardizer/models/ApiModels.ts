export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface CreateJobResponse {
  jobId: string;
  status: JobStatus;
}

export interface JobRecord {
  jobId: string;
  status: JobStatus;
  progress: number;
  outputDownloadUrl?: string;
  jsonDownloadUrl?: string;
  errorMessage?: string;
}
