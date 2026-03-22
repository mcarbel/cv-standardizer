import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import type { Express } from 'express';
import type {
  CreateJobRequestFields,
  JobRecord,
  OutputFormat,
  Provider
} from '@cv-standardizer/shared-contracts';
import type { DownloadFileInfo } from '../domain/job.types';
import { extractText } from './extraction.service';
import { renderOutput } from './render.service';
import { transformCv } from './transform.service';

type MulterFile = Express.Multer.File;

interface StoredJob extends JobRecord {
  outputPath?: string;
  jsonPath?: string;
}

export class JobService {
  private readonly jobs = new Map<string, StoredJob>();
  private readonly storageRoot = path.resolve(process.env.STORAGE_ROOT || path.join(process.cwd(), 'storage'));

  async createJob(file: MulterFile, rawFields: Record<string, string>): Promise<JobRecord> {
    const fields = this.normalizeFields(rawFields);
    const jobId = `job_${crypto.randomUUID()}`;
    const jobDir = path.join(this.storageRoot, 'jobs', jobId);
    await fs.mkdir(jobDir, { recursive: true });

    const createdAt = new Date().toISOString();
    const job: StoredJob = {
      jobId,
      status: 'queued',
      provider: fields.provider,
      model: fields.model,
      inputFileName: file.originalname,
      outputFormat: fields.outputFormat,
      progress: 0,
      createdAt,
      updatedAt: createdAt
    };
    this.jobs.set(jobId, job);

    void this.processJob(jobId, file, fields, jobDir);

    return this.publicJob(job);
  }

  private async processJob(
    jobId: string,
    file: MulterFile,
    fields: CreateJobRequestFields,
    jobDir: string
  ): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) {
      return;
    }

    try {
      job.status = 'processing';
      job.progress = 5;
      job.updatedAt = new Date().toISOString();
      console.log(`[job ${jobId}] start provider=${fields.provider} model=${fields.model} output=${fields.outputFormat} file=${file.originalname}`);
      const sourcePath = path.join(jobDir, file.originalname);
      await fs.writeFile(sourcePath, file.buffer);
      job.progress = 20;
      job.updatedAt = new Date().toISOString();
      console.log(`[job ${jobId}] source saved -> ${sourcePath}`);

      const extractedText = await extractText(file.originalname, file.buffer);
      job.progress = 40;
      job.updatedAt = new Date().toISOString();
      console.log(`[job ${jobId}] text extracted length=${extractedText.length}`);

      const cv = await transformCv(extractedText, {
        provider: fields.provider,
        model: fields.model,
        providerBaseUrl: fields.providerBaseUrl,
        apiKey: fields.apiKey,
        sourceFileName: file.originalname,
        outputFormat: fields.outputFormat
      });
      job.progress = 75;
      job.updatedAt = new Date().toISOString();
      console.log(`[job ${jobId}] transform complete fullName="${cv.fullName}" title="${cv.title}"`);

      const baseName = path.parse(file.originalname).name + '_standardise';
      const outputPath = await renderOutput(cv, fields.outputFormat, jobDir, baseName);
      const jsonPath = path.join(jobDir, `${baseName}.json`);
      await fs.writeFile(jsonPath, JSON.stringify(cv, null, 2), 'utf-8');
      job.progress = 100;
      job.status = 'completed';
      job.updatedAt = new Date().toISOString();
      job.outputPath = outputPath;
      job.jsonPath = jsonPath;
      job.outputDownloadUrl = `/api/jobs/${jobId}/result`;
      job.jsonDownloadUrl = `/api/jobs/${jobId}/json`;
      console.log(`[job ${jobId}] completed output=${outputPath}`);
    } catch (error) {
      job.status = 'failed';
      job.updatedAt = new Date().toISOString();
      job.errorMessage = error instanceof Error ? error.message : 'Unknown job error';
      console.error(`[job ${jobId}] failed:`, error);
    }
  }

  async get(jobId: string): Promise<JobRecord> {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error(`Unknown job: ${jobId}`);
    }
    return this.publicJob(job);
  }

  async getResultFile(jobId: string): Promise<DownloadFileInfo> {
    const job = this.jobs.get(jobId);
    if (!job?.outputPath) {
      throw new Error('Result file not found');
    }
    return {
      path: job.outputPath,
      name: path.basename(job.outputPath)
    };
  }

  async getJsonFile(jobId: string): Promise<DownloadFileInfo> {
    const job = this.jobs.get(jobId);
    if (!job?.jsonPath) {
      throw new Error('JSON file not found');
    }
    return {
      path: job.jsonPath,
      name: path.basename(job.jsonPath)
    };
  }

  private normalizeFields(rawFields: Record<string, string>): CreateJobRequestFields {
    return {
      provider: (rawFields.provider || 'heuristic') as Provider,
      model: rawFields.model || 'gpt-5',
      outputFormat: (rawFields.outputFormat || 'docx') as OutputFormat,
      providerBaseUrl: rawFields.providerBaseUrl || undefined,
      apiKey: rawFields.apiKey || undefined,
      dumpJson: rawFields.dumpJson === 'true'
    };
  }

  private publicJob(job: StoredJob): JobRecord {
    return {
      jobId: job.jobId,
      status: job.status,
      provider: job.provider,
      model: job.model,
      inputFileName: job.inputFileName,
      outputFormat: job.outputFormat,
      progress: job.progress,
      errorMessage: job.errorMessage,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      outputDownloadUrl: job.outputDownloadUrl,
      jsonDownloadUrl: job.jsonDownloadUrl
    };
  }
}
