/**
 * @swagger
 * tags:
 *   name: Terms of Service
 *   description: API endpoints for Terms of Service
 */

/**
 * @swagger
 * /api/tos/download:
 *   get:
 *     summary: Download Terms of Service file
 *     tags: [Terms of Service]
 *     parameters:
 *       - in: query
 *         name: file
 *         required: true
 *         schema:
 *           type: string
 *         description: File path relative to data directory
 *     responses:
 *       200:
 *         description: File content as plain text
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *
 * /api/tos/version:
 *   get:
 *     summary: Get current ToS version information
 *     tags: [Terms of Service]
 *     responses:
 *       200:
 *         description: Current version information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 version:
 *                   type: string
 *                 effectiveDate:
 *                   type: string
 *                 lastUpdated:
 *                   type: string
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import { NotFoundError } from '../utils/errors';

const router = express.Router();

// Download Terms of Service as a text file
router.get('/download', async (req, res, next) => {
  try {
    const filePath = req.query.file as string;
    const fullPath = path.join(__dirname, '..', '..', 'data', filePath);

    if (!fs.existsSync(fullPath)) {
      throw new NotFoundError('File', filePath);
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    res.setHeader('Content-Type', 'text/plain');
    res.send(content);
  } catch (error) {
    next(error);
  }
});

// Get current ToS version
router.get('/version', async (req, res, next) => {
  try {
    const version = {
      version: '2.1.0',
      effectiveDate: '2025-01-15',
      lastUpdated: '2025-01-10',
    };
    res.json(version);
  } catch (error) {
    next(error);
  }
});

export default router;