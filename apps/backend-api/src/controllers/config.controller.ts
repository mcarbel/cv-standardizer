import type { Request, Response } from 'express';
import type { CapabilitiesResponse } from '@cv-standardizer/shared-contracts';

export async function getCapabilities(_req: Request, res: Response): Promise<void> {
  const payload: CapabilitiesResponse = {
    providers: ['heuristic', 'openai', 'ollama'],
    outputFormats: ['docx', 'pdf', 'markdown'],
    maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB || 10),
    ollamaReachable: true
  };

  res.json(payload);
}
