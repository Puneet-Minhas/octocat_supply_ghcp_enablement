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

// Get current ToS version
router.get('/version', (req, res) => {
  const version = {
    version: '2.1.0',
    effectiveDate: '2025-01-15',
    lastUpdated: '2025-01-10',
  };
  res.json(version);
});

export default router;