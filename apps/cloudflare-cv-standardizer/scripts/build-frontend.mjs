import { cp, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const src = resolve(root, 'frontend/src');
const dist = resolve(root, 'frontend/dist');

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(src, dist, { recursive: true });

console.log(`Cloudflare frontend built in ${dist}`);
