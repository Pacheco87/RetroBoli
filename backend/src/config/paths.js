import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = dirname(fileURLToPath(import.meta.url));

export const projectRoot = resolve(currentDir, '../../..');
export const uploadsDir = resolve(projectRoot, 'backend/uploads');
export const frontendDistDir = resolve(projectRoot, 'frontend/dist');
