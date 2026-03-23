import type { CreateJobResponse, JobRecord } from '../models/ApiModels';

export interface ConnectionTestResult {
  api: {
    ok: boolean;
    url: string;
    serverTime: string;
    nodeVersion: string;
    defaultOllamaBaseUrl: string;
  };
  ollama: {
    ok: boolean;
    url: string;
    statusCode?: number;
    message?: string;
    modelCount?: number;
    models?: Array<{
      name: string;
      model: string;
      size: number;
      modifiedAt?: string;
      remoteHost?: string;
    }>;
  };
}

export interface HealthCheckResult {
  ok: boolean;
  url: string;
  status?: number;
  payload?: unknown;
  diagnosis?: string;
}

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

  public async testConnections(providerBaseUrl: string): Promise<ConnectionTestResult> {
    const query = new URLSearchParams({
      providerBaseUrl
    });
    const response = await fetch(`${this.apiBaseUrl}/api/config/test-connections?${query.toString()}`);
    const payload = await response.json() as ConnectionTestResult;
    if (!response.ok) {
      throw new Error(payload.ollama.message || `Connection test failed: ${response.status}`);
    }
    return payload;
  }

  public async healthCheck(): Promise<HealthCheckResult> {
    const url = `${this.apiBaseUrl}/api/health`;

    try {
      const response = await fetch(url, { method: 'GET' });
      let payload: unknown;

      try {
        payload = await response.json();
      } catch (_error) {
        payload = undefined;
      }

      if (!response.ok) {
        return {
          ok: false,
          url,
          status: response.status,
          payload,
          diagnosis: `Backend returned HTTP ${response.status}.`
        };
      }

      return {
        ok: true,
        url,
        status: response.status,
        payload
      };
    } catch (error) {
      return {
        ok: false,
        url,
        diagnosis: buildConnectivityDiagnosis(error)
      };
    }
  }
}

function buildConnectivityDiagnosis(error: unknown): string {
  const message = error instanceof Error ? error.message : 'Load failed';
  const normalized = message.toLowerCase();

  if (normalized.includes('load failed')) {
    return 'Backend unreachable from the browser. Likely certificate trust, CORS, or Private Network Access blocking.';
  }

  if (normalized.includes('failed to fetch')) {
    return 'Browser blocked the request before the backend responded. Likely certificate trust, CORS, or Private Network Access.';
  }

  return message;
}
