import type { CreateJobResponse, JobRecord } from '../models/ApiModels';

export class ApiClient {
  public constructor(private readonly apiBaseUrl: string) {}

  public async createJob(file: File, fields: Record<string, string | boolean>): Promise<CreateJobResponse> {
    const form = new FormData();
    form.append('file', file);

    for (const key in fields) {
      if (Object.prototype.hasOwnProperty.call(fields, key)) {
        form.append(key, String(fields[key]));
      }
    }

    const response = await fetch(`${this.apiBaseUrl}/api/jobs`, {
      method: 'POST',
      body: form
    });

    if (!response.ok) {
      throw new Error(`Failed to create job: ${response.status}`);
    }

    return response.json() as Promise<CreateJobResponse>;
  }

  public async getJob(jobId: string): Promise<JobRecord> {
    const response = await fetch(`${this.apiBaseUrl}/api/jobs/${jobId}`);
    if (!response.ok) {
      throw new Error(`Failed to load job: ${response.status}`);
    }
    return response.json() as Promise<JobRecord>;
  }
}
