import type { NextFunction, Request, Response } from 'express';
import { JobService } from '../services/job.service';

const service = new JobService();

export async function createJob(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      throw new Error('Missing uploaded file');
    }

    const job = await service.createAndRun(req.file, req.body);
    res.status(202).json({ jobId: job.jobId, status: job.status });
  } catch (error) {
    next(error);
  }
}

export async function getJob(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const jobId = Array.isArray(req.params.jobId) ? req.params.jobId[0] : req.params.jobId;
    const job = await service.get(jobId);
    res.json(job);
  } catch (error) {
    next(error);
  }
}

export async function downloadResult(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const jobId = Array.isArray(req.params.jobId) ? req.params.jobId[0] : req.params.jobId;
    const file = await service.getResultFile(jobId);
    res.download(file.path, file.name);
  } catch (error) {
    next(error);
  }
}

export async function downloadJson(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const jobId = Array.isArray(req.params.jobId) ? req.params.jobId[0] : req.params.jobId;
    const file = await service.getJsonFile(jobId);
    res.download(file.path, file.name);
  } catch (error) {
    next(error);
  }
}
