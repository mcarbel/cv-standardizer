import type { Request, Response } from 'express';
import type { ParsedQs } from 'qs';
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

export async function testConnections(req: Request, res: Response): Promise<void> {
  const providerBaseUrl = normalizeQueryValue(req.query.providerBaseUrl) || process.env.DEFAULT_OLLAMA_BASE_URL || 'http://localhost:11434';
  const apiHealth = {
    ok: true,
    url: '/api/health'
  };

  try {
    const ollamaUrl = providerBaseUrl.replace(/\/$/, '');
    const response = await fetch(`${ollamaUrl}/api/tags`);
    if (!response.ok) {
      res.status(502).json({
        api: apiHealth,
        ollama: {
          ok: false,
          url: ollamaUrl,
          message: `HTTP ${response.status}`
        }
      });
      return;
    }

    const payload = await response.json() as { models?: Array<{ name?: string }> };
    const modelNames = (payload.models || [])
      .map((item) => item.name)
      .filter((value): value is string => Boolean(value))
      .slice(0, 10);

    res.json({
      api: apiHealth,
      ollama: {
        ok: true,
        url: ollamaUrl,
        models: modelNames
      }
    });
  } catch (error) {
    res.status(502).json({
      api: apiHealth,
      ollama: {
        ok: false,
        url: providerBaseUrl,
        message: error instanceof Error ? error.message : 'Unknown Ollama connection error'
      }
    });
  }
}

function normalizeQueryValue(value: string | ParsedQs | (string | ParsedQs)[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    const first = value[0];
    return typeof first === 'string' ? first : undefined;
  }
  return typeof value === 'string' ? value : undefined;
}
