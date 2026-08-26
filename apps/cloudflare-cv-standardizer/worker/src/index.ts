import { corsHeaders, json, notFound, safeFileName } from './http';
import { appendEvent, getJobRecord, insertJob } from './repository';
import { processJob } from './processor';
import type { CreateJobOptions, Env, JobQueueMessage, PublicJobRecord } from './types';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(env) });
    }

    const url = new URL(request.url);

    try {
      if (url.pathname === '/api/health') {
        return json({
          ok: true,
          runtime: 'cloudflare-workers',
          storage: { d1: Boolean(env.DB), r2: Boolean(env.CV_FILES), queue: Boolean(env.CV_JOBS_QUEUE) },
          time: new Date().toISOString()
        }, env);
      }

      if (url.pathname === '/api/capabilities') {
        return json({
          providers: ['heuristic', 'openai', 'ollama'],
          outputFormats: ['docx', 'pdf', 'markdown'],
          maxFileSizeMb: 10,
          ollamaReachable: Boolean(env.OLLAMA_BASE_URL)
        }, env);
      }

      if (url.pathname === '/api/templates') {
        return json({
          templates: [
            { key: 'standard', label: 'Standard', description: 'Clean ATS-friendly CV layout.' },
            { key: 'modern', label: 'Modern', description: 'Sharper visual hierarchy for client sharing.' },
            { key: 'consulting', label: 'Consulting', description: 'Cabinet-style CV with stronger sections and branding.' }
          ],
          languages: [
            { key: 'en', label: 'English' },
            { key: 'fr', label: 'French' }
          ]
        }, env);
      }

      if (url.pathname === '/api/providers/ollama/models' && request.method === 'GET') {
        return listOllamaModels(url, env);
      }

      if (url.pathname === '/api/jobs' && request.method === 'POST') {
        return createJob(request, env, ctx);
      }

      const jobMatch = url.pathname.match(/^\/api\/jobs\/([^/]+)$/);
      if (jobMatch && request.method === 'GET') {
        const job = await getJobRecord(env, jobMatch[1]);
        return job ? json(toPublicJob(job), env) : json({ error: 'job_not_found', jobId: jobMatch[1] }, env, 404);
      }

      const artifactMatch = url.pathname.match(/^\/api\/jobs\/([^/]+)\/(result|json)$/);
      if (artifactMatch && request.method === 'GET') {
        return getJobArtifact(artifactMatch[1], artifactMatch[2], env);
      }

      return notFound(url.pathname, env);
    } catch (error) {
      return json({
        error: 'internal_error',
        message: error instanceof Error ? error.message : 'Unexpected error'
      }, env, 500);
    }
  },

  async queue(batch: MessageBatch<JobQueueMessage>, env: Env): Promise<void> {
    for (const message of batch.messages) {
      await processJob(env, message.body.jobId, {
        apiKey: message.body.apiKey,
        providerBaseUrl: message.body.providerBaseUrl,
        extractedTextObjectKey: message.body.extractedTextObjectKey
      });
      message.ack();
    }
  }
};

async function createJob(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const form = await request.formData();
  const file = form.get('file');

  if (!(file instanceof File)) {
    return json({ error: 'file_required', message: 'Upload a PDF, DOCX, or TXT file using the file field.' }, env, 400);
  }

  const options = parseCreateJobOptions(form, env);
  const jobId = `job_${crypto.randomUUID()}`;
  const inputKey = `jobs/${jobId}/input/${safeFileName(file.name)}`;
  const extractedTextOverride = await textValue(form.get('extractedTextOverride'));
  const extractedTextObjectKey = extractedTextOverride ? `jobs/${jobId}/input/extracted-text.txt` : undefined;
  const extension = options.outputFormat === 'markdown' ? 'md' : options.outputFormat;
  const jsonKey = `jobs/${jobId}/result/cv-standardized.json`;
  const resultKey = `jobs/${jobId}/result/cv-standardized.${extension}`;

  await env.CV_FILES.put(inputKey, file.stream(), {
    httpMetadata: { contentType: file.type || 'application/octet-stream' },
    customMetadata: { originalFileName: file.name, jobId }
  });

  if (extractedTextObjectKey && extractedTextOverride) {
    await env.CV_FILES.put(extractedTextObjectKey, extractedTextOverride.slice(0, 50000), {
      httpMetadata: { contentType: 'text/plain; charset=utf-8' },
      customMetadata: { originalFileName: file.name, jobId, source: 'browser-extraction' }
    });
  }

  await insertJob(env, {
    jobId,
    inputFileName: file.name,
    inputObjectKey: inputKey,
    outputObjectKey: resultKey,
    jsonObjectKey: jsonKey,
    options
  });

  await appendEvent(env, jobId, 'jobs.create', {
    provider: options.provider,
    model: options.model,
    outputFormat: options.outputFormat,
    outputLanguage: options.outputLanguage,
    templateStyle: options.templateStyle,
    inputFileName: file.name,
    browserExtractedCharacters: extractedTextOverride?.length || 0
  });

  if (env.CV_JOBS_QUEUE) {
    await env.CV_JOBS_QUEUE.send({
      jobId,
      providerBaseUrl: options.providerBaseUrl,
      apiKey: options.apiKey,
      extractedTextObjectKey
    });
  } else {
    ctx.waitUntil(processJob(env, jobId, {
      apiKey: options.apiKey,
      providerBaseUrl: options.providerBaseUrl,
      extractedTextObjectKey
    }));
  }

  return json({ jobId, status: 'queued', progress: 5 }, env, 202);
}

async function listOllamaModels(url: URL, env: Env): Promise<Response> {
  const providerBaseUrl = (url.searchParams.get('providerBaseUrl') || env.OLLAMA_BASE_URL || '').replace(/\/+$/, '');

  if (!providerBaseUrl) {
    return json({
      ok: false,
      models: [],
      message: 'Ollama providerBaseUrl is required.'
    }, env, 400);
  }

  try {
    const response = await fetch(`${providerBaseUrl}/api/tags`, {
      headers: { accept: 'application/json' }
    });
    const payload = await response.json() as { models?: Array<{ name?: string; model?: string; modified_at?: string; size?: number }> };
    const listedModels = (payload.models || [])
      .map((model) => ({
        name: model.name || model.model || '',
        modifiedAt: model.modified_at,
        size: model.size
      }))
      .filter((model) => model.name)
      .sort((left, right) => left.name.localeCompare(right.name));
    const checkedModels = await Promise.all(listedModels.map((model) => checkOllamaModelAvailability(providerBaseUrl, model)));
    const models = checkedModels.filter((model) => model.available);
    const unavailableModels = checkedModels.filter((model) => !model.available);

    return json({
      ok: response.ok,
      providerBaseUrl,
      status: response.status,
      models,
      unavailableModels,
      count: models.length,
      unavailableCount: unavailableModels.length
    }, env, response.ok ? 200 : 502);
  } catch (error) {
    return json({
      ok: false,
      providerBaseUrl,
      models: [],
      message: error instanceof Error ? error.message : 'Unable to load Ollama models.'
    }, env, 502);
  }
}

async function checkOllamaModelAvailability(
  providerBaseUrl: string,
  model: { name: string; modifiedAt?: string; size?: number }
): Promise<{ name: string; modifiedAt?: string; size?: number; available: boolean; unavailableReason?: string }> {
  if (!shouldProbeOllamaModel(model)) {
    return { ...model, available: true };
  }

  try {
    const response = await fetch(`${providerBaseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        model: model.name,
        stream: false,
        messages: [{ role: 'user', content: 'Return OK.' }],
        options: { num_predict: 1 }
      })
    });

    if (response.ok) {
      return { ...model, available: true };
    }

    const message = await response.text();
    return {
      ...model,
      available: false,
      unavailableReason: `HTTP ${response.status}: ${message.slice(0, 220)}`
    };
  } catch (error) {
    return {
      ...model,
      available: false,
      unavailableReason: error instanceof Error ? error.message : 'Availability check failed.'
    };
  }
}

function shouldProbeOllamaModel(model: { name: string; size?: number }): boolean {
  return model.name.endsWith(':cloud') || Number(model.size || 0) < 1000000;
}

async function getJobArtifact(jobId: string, kind: string, env: Env): Promise<Response> {
  const job = await getJobRecord(env, jobId);
  if (!job) {
    return json({ error: 'job_not_found', jobId }, env, 404);
  }

  const key = kind === 'json' ? job.jsonObjectKey : job.outputObjectKey;
  const object = await env.CV_FILES.get(key);
  if (!object) {
    return json({
      error: 'artifact_pending',
      message: 'The job is completed but the R2 artifact is not visible yet. Retry the download in a few seconds.',
      jobId,
      kind
    }, env, 409);
  }

  return new Response(object.body, {
    headers: {
      ...corsHeaders(env),
      'content-type': object.httpMetadata?.contentType || 'application/octet-stream',
      'content-disposition': `attachment; filename="${key.split('/').pop()}"`
    }
  });
}

function parseCreateJobOptions(form: FormData, env: Env): CreateJobOptions {
  return {
    provider: normalizeChoice(form.get('provider'), ['heuristic', 'openai', 'ollama'], env.DEFAULT_PROVIDER || 'heuristic'),
    model: stringValue(form.get('model'), env.DEFAULT_MODEL || 'heuristic'),
    outputFormat: normalizeChoice(form.get('outputFormat'), ['docx', 'pdf', 'markdown'], 'pdf'),
    outputLanguage: normalizeChoice(form.get('outputLanguage'), ['en', 'fr'], 'en'),
    templateStyle: normalizeChoice(form.get('templateStyle'), ['standard', 'modern', 'consulting'], 'consulting'),
    anonymizeCandidateName: stringValue(form.get('anonymizeCandidateName'), 'false') === 'true',
    providerBaseUrl: optionalString(form.get('providerBaseUrl')),
    apiKey: optionalString(form.get('apiKey')),
    dumpJson: stringValue(form.get('dumpJson'), 'false') === 'true'
  };
}

function toPublicJob(job: Awaited<ReturnType<typeof getJobRecord>> extends infer T ? NonNullable<T> : never): PublicJobRecord {
  return {
    jobId: job.jobId,
    status: job.status,
    provider: job.provider,
    model: job.model,
    inputFileName: job.inputFileName,
    outputFormat: job.outputFormat,
    outputLanguage: job.outputLanguage,
    templateStyle: job.templateStyle,
    progress: job.progress,
    errorMessage: job.errorMessage,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    outputDownloadUrl: job.status === 'completed' ? `/api/jobs/${job.jobId}/result` : undefined,
    jsonDownloadUrl: job.status === 'completed' ? `/api/jobs/${job.jobId}/json` : undefined
  };
}

function normalizeChoice<T extends string>(value: FormDataEntryValue | null, allowed: T[], fallback: string): T {
  const candidate = stringValue(value, fallback) as T;
  return allowed.includes(candidate) ? candidate : allowed[0];
}

function stringValue(value: FormDataEntryValue | null, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function optionalString(value: FormDataEntryValue | null): string | undefined {
  const parsed = stringValue(value, '');
  return parsed || undefined;
}

async function textValue(value: FormDataEntryValue | null): Promise<string | undefined> {
  if (typeof value === 'string') {
    return value.trim() || undefined;
  }

  if (value instanceof File) {
    const text = await value.text();
    return text.trim() || undefined;
  }

  return undefined;
}
