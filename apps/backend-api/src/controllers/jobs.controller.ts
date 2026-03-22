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
    const job = await service.get(req.params.jobId);
    res.json(job);
  } catch (error) {
    next(error);
  }
}

export async function downloadResult(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const file = await service.getResultFile(req.params.jobId);
    res.download(file.path, file.name);
  } catch (error) {
    next(error);
  }
}

export async function downloadJson(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const file = await service.getJsonFile(req.params.jobId);
    res.download(file.path, file.name);
  } catch (error) {
    next(error);
  }
}
