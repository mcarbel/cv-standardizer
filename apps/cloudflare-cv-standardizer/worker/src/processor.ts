import { extractTextFromObject } from './extraction';
import { safeFileName } from './http';
import { appendEvent, getJobRecord, updateJob } from './repository';
import { renderOutput } from './renderer';
import { transformCvText } from './providers';
import type { CreateJobOptions, CVData, Env } from './types';

export async function processJob(env: Env, jobId: string, options: Pick<CreateJobOptions, 'apiKey' | 'providerBaseUrl'> & {
  extractedTextObjectKey?: string;
} = {}): Promise<void> {
  const job = await getJobRecord(env, jobId);
  if (!job) {
    return;
  }

  try {
    await updateJob(env, jobId, 'processing', 25);
    await appendEvent(env, jobId, 'jobs.processing', { step: 'load-input' });

    const object = await env.CV_FILES.get(job.inputObjectKey);
    if (!object) {
      throw new Error(`Input object not found in R2: ${job.inputObjectKey}`);
    }

    const extractedText = await loadExtractedTextOverride(env, options.extractedTextObjectKey)
      || await extractTextFromObject(object, job.inputFileName);
    await updateJob(env, jobId, 'processing', 45);
    await appendEvent(env, jobId, 'jobs.extracted', {
      characters: extractedText.length,
      source: options.extractedTextObjectKey ? 'browser-extraction' : 'worker-fallback'
    });

    const cv = await transformCvText({
      job,
      options,
      fallbackOpenAiKey: env.OPENAI_API_KEY,
      defaultOllamaBaseUrl: env.OLLAMA_BASE_URL,
      extractedText
    });
    await updateJob(env, jobId, 'processing', 78);
    await appendEvent(env, jobId, 'jobs.transformed', { provider: job.provider, model: job.model });

    const output = await renderOutput(cv, job.outputFormat);
    const outputKey = `jobs/${jobId}/result/${buildOutputFileName(cv, output.fileExtension)}`;

    await env.CV_FILES.put(job.jsonObjectKey, JSON.stringify(cv, null, 2), {
      httpMetadata: { contentType: 'application/json; charset=utf-8' }
    });
    await env.CV_FILES.put(outputKey, output.body, {
      httpMetadata: { contentType: output.contentType }
    });

    if (outputKey !== job.outputObjectKey) {
      await env.DB.prepare('UPDATE jobs SET output_object_key = ? WHERE job_id = ?').bind(outputKey, jobId).run();
    }

    await updateJob(env, jobId, 'completed', 100);
    await appendEvent(env, jobId, 'jobs.completed', { jsonObjectKey: job.jsonObjectKey, outputObjectKey: outputKey });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Job processing failed.';
    await updateJob(env, jobId, 'failed', 100, message);
    await appendEvent(env, jobId, 'jobs.failed', { message });
  }
}

function buildOutputFileName(cv: CVData, extension: string): string {
  const language = cv.meta.outputLanguage || 'en';
  const template = cv.meta.templateStyle || 'standard';
  const candidate = slugifyFilePart(cv.fullName || 'candidate') || 'candidate';
  return safeFileName(`${language}_${candidate}_${template}_standardise.${extension}`);
}

function slugifyFilePart(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80);
}

async function loadExtractedTextOverride(env: Env, objectKey?: string): Promise<string | undefined> {
  if (!objectKey) {
    return undefined;
  }

  const object = await env.CV_FILES.get(objectKey);
  const text = object ? await object.text() : '';
  const cleaned = text.replace(/\n{3,}/g, '\n\n').trim();
  return cleaned.length > 80 ? cleaned : undefined;
}
