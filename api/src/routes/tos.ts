import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Download Terms of Service as a text file
router.get('/download', (req, res) => {
  const filePath = req.query.file as string;
  const fullPath = path.join(__dirname, '..', '..', 'data', filePath);

  if (!fs.existsSync(fullPath)) {
    res.status(404).send('File not found');
    return;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  res.setHeader('Content-Type', 'text/plain');
  res.send(content);
});

/**
 * @swagger
 * /tos/version:
 *   get:
 *     summary: Get current Terms of Service version
 *     description: Returns metadata about the currently active Terms of Service version.
 *     tags:
 *       - Terms of Service
 *     responses:
 *       200:
 *         description: Current ToS version metadata.
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
 *       500:
 *         description: Failed to load ToS version configuration.
 */
// Get current ToS version
router.get('/version', (req, res) => {
  const versionFilePath = path.join(__dirname, '..', '..', 'data', 'tos-version.json');

  try {
    if (!fs.existsSync(versionFilePath)) {
      res.status(500).json({ error: 'ToS version configuration not found' });
      return;
    }

    const raw = fs.readFileSync(versionFilePath, 'utf-8');
    const config = JSON.parse(raw);

    if (
      !config ||
      typeof config.version !== 'string' ||
      typeof config.effectiveDate !== 'string' ||
      typeof config.lastUpdated !== 'string'
    ) {
      res.status(500).json({ error: 'Invalid ToS version configuration format' });
      return;
    }

    res.json(config);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load ToS version configuration' });
  }
});

export default router;