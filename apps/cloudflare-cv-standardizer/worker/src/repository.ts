import type { CreateJobOptions, Env, JobRecord, JobStatus } from './types';

export async function insertJob(env: Env, params: {
  jobId: string;
  inputFileName: string;
  inputObjectKey: string;
  outputObjectKey: string;
  jsonObjectKey: string;
  options: CreateJobOptions;
}): Promise<void> {
  const now = new Date().toISOString();
  await env.DB.prepare(`
    INSERT INTO jobs (
      job_id, status, provider, model, input_file_name, input_object_key, output_format,
      output_language, template_style, anonymize_candidate_name, progress,
      output_object_key, json_object_key, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    params.jobId,
    'queued',
    params.options.provider,
    params.options.model,
    params.inputFileName,
    params.inputObjectKey,
    params.options.outputFormat,
    params.options.outputLanguage,
    params.options.templateStyle,
    params.options.anonymizeCandidateName ? 1 : 0,
    5,
    params.outputObjectKey,
    params.jsonObjectKey,
    now,
    now
  ).run();
}

export async function getJobRecord(env: Env, jobId: string): Promise<JobRecord | undefined> {
  const row = await env.DB.prepare('SELECT * FROM jobs WHERE job_id = ?').bind(jobId).first<Record<string, unknown>>();
  return row ? mapJobRecord(row) : undefined;
}

export async function updateJob(env: Env, jobId: string, status: JobStatus, progress: number, errorMessage?: string): Promise<void> {
  await env.DB.prepare('UPDATE jobs SET status = ?, progress = ?, error_message = ?, updated_at = ? WHERE job_id = ?')
    .bind(status, progress, errorMessage || null, new Date().toISOString(), jobId)
    .run();
}

export async function appendEvent(env: Env, jobId: string, eventType: string, payload: unknown): Promise<void> {
  await env.DB.prepare('INSERT INTO job_events (job_id, event_type, payload_json, created_at) VALUES (?, ?, ?, ?)')
    .bind(jobId, eventType, JSON.stringify(payload), new Date().toISOString())
    .run();
}

function mapJobRecord(row: Record<string, unknown>): JobRecord {
  return {
    jobId: String(row.job_id),
    status: String(row.status) as JobRecord['status'],
    provider: String(row.provider) as JobRecord['provider'],
    model: String(row.model),
    inputFileName: String(row.input_file_name),
    inputObjectKey: String(row.input_object_key),
    outputFormat: String(row.output_format) as JobRecord['outputFormat'],
    outputLanguage: String(row.output_language) as JobRecord['outputLanguage'],
    templateStyle: String(row.template_style) as JobRecord['templateStyle'],
    anonymizeCandidateName: Number(row.anonymize_candidate_name || 0) === 1,
    progress: Number(row.progress || 0),
    errorMessage: row.error_message ? String(row.error_message) : undefined,
    outputObjectKey: String(row.output_object_key),
    jsonObjectKey: String(row.json_object_key),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at)
  };
}
