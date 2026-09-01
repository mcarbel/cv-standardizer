import type { Env } from './types';

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8'
};

export function json(body: unknown, env: Env, status = 200): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      ...JSON_HEADERS,
      ...corsHeaders(env)
    }
  });
}

export function corsHeaders(env: Env): HeadersInit {
  return {
    'access-control-allow-origin': env.CORS_ORIGIN || '*',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type,authorization,x-api-key'
  };
}

export function notFound(path: string, env: Env): Response {
  return json({ error: 'not_found', path }, env, 404);
}

export function safeFileName(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'cv-upload';
}
