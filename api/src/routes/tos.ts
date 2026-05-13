/**
 * @swagger
 * tags:
 *   name: TermsOfService
 *   description: Terms of Service endpoints
 */

/**
 * @swagger
 * /api/tos/download:
 *   get:
 *     summary: Download the Terms of Service as a text file
 *     tags: [TermsOfService]
 *     parameters:
 *       - in: query
 *         name: file
 *         required: true
 *         schema:
 *           type: string
 *         description: Relative filename of the Terms of Service text file to download
 *     responses:
 *       200:
 *         description: Plain text Terms of Service content
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       400:
 *         description: Missing or invalid file parameter
 *       404:
 *         description: File not found
 *
 * /api/tos/version:
 *   get:
 *     summary: Get current Terms of Service version
 *     tags: [TermsOfService]
 *     responses:
 *       200:
 *         description: Current ToS version metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 version:
 *                   type: string
 *                   example: "2.1.0"
 *                 effectiveDate:
 *                   type: string
 *                   format: date
 *                   example: "2025-01-15"
 *                 lastUpdated:
 *                   type: string
 *                   format: date
 *                   example: "2025-01-10"
 *               required:
 *                 - version
 *                 - effectiveDate
 *                 - lastUpdated
 *       500:
 *         description: Failed to load ToS version configuration
 */

import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { ConfigurationError, NotFoundError, ValidationError } from '../utils/errors';

interface TosVersionConfig {
  version: string;
  effectiveDate: string;
  lastUpdated: string;
}

const router = express.Router();
const tosDataDirectory = path.resolve(__dirname, '..', '..', 'resources', 'tos');
const tosVersionFilePath = path.join(tosDataDirectory, 'tos-version.json');

function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error;
}

function isTosVersionConfig(value: unknown): value is TosVersionConfig {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const config = value as Record<string, unknown>;
  return (
    typeof config.version === 'string' &&
    typeof config.effectiveDate === 'string' &&
    typeof config.lastUpdated === 'string'
  );
}

function normalizePath(filePath: string): string {
  const normalizedPath = path.normalize(filePath);
  return process.platform === 'win32' ? normalizedPath.toLowerCase() : normalizedPath;
}

router.get('/download', async (req, res, next) => {
  try {
    const fileParam = req.query.file;

    if (typeof fileParam !== 'string' || fileParam.trim() === '') {
      next(new ValidationError('Missing or invalid file parameter'));
      return;
    }

    const fileName = fileParam.trim();
    if (
      fileName !== path.basename(fileName) ||
      fileName.startsWith('.') ||
      fileName.includes('\0') ||
      fileName.includes('/') ||
      fileName.includes('\\')
    ) {
      next(new ValidationError('Invalid file parameter'));
      return;
    }

    const fullPath = path.resolve(tosDataDirectory, fileName);
    const comparableBasePath = normalizePath(tosDataDirectory);
    const comparableFullPath = normalizePath(fullPath);
    const relativePath = path.relative(comparableBasePath, comparableFullPath);

    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
      next(new ValidationError('Invalid file parameter'));
      return;
    }

    const fileStats = await fs.promises.stat(fullPath);
    if (!fileStats.isFile()) {
      next(new NotFoundError('File', fileName));
      return;
    }

    const content = await fs.promises.readFile(fullPath, 'utf-8');
    res.type('text/plain').send(content);
  } catch (error) {
    if (isErrnoException(error) && error.code === 'ENOENT') {
      next(new NotFoundError('File', String(req.query.file)));
      return;
    }

    next(error);
  }
});

router.get('/version', async (_req, res, next) => {
  try {
    const rawConfig = await fs.promises.readFile(tosVersionFilePath, 'utf-8');
    const config: unknown = JSON.parse(rawConfig);

    if (!isTosVersionConfig(config)) {
      next(new ConfigurationError('Invalid ToS version configuration format'));
      return;
    }

    res.json(config);
  } catch (error) {
    if (isErrnoException(error) && error.code === 'ENOENT') {
      next(new ConfigurationError('ToS version configuration not found'));
      return;
    }

    if (error instanceof SyntaxError) {
      next(new ConfigurationError('Invalid ToS version configuration format'));
      return;
    }

    next(new ConfigurationError('Failed to load ToS version configuration'));
  }
});

export default router;
