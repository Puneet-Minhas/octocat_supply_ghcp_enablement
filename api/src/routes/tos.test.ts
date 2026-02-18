import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import fs from 'fs';
import path from 'path';
import tosRouter from './tos';
import { errorHandler } from '../utils/errors';

let app: express.Express;
let testDataDir: string;
let testFilePath: string;

describe('ToS API', () => {
  beforeAll(() => {
    // Create a temporary data directory for tests
    testDataDir = path.join(__dirname, '..', '..', 'data');
    if (!fs.existsSync(testDataDir)) {
      fs.mkdirSync(testDataDir, { recursive: true });
    }

    // Create a test file
    testFilePath = path.join(testDataDir, 'test-tos.txt');
    fs.writeFileSync(testFilePath, 'Test Terms of Service Content');
  });

  afterAll(() => {
    // Clean up test files
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  beforeEach(() => {
    // Set up express app
    app = express();
    app.use(express.json());
    app.use('/tos', tosRouter);
    // Attach error handler to translate errors
    app.use(errorHandler);
  });

  describe('GET /tos/download', () => {
    it('should download an existing file', async () => {
      const response = await request(app).get('/tos/download?file=test-tos.txt');
      expect(response.status).toBe(200);
      expect(response.header['content-type']).toBe('text/plain; charset=utf-8');
      expect(response.text).toBe('Test Terms of Service Content');
    });

    it('should return 404 error for non-existing file using NotFoundError', async () => {
      const response = await request(app).get('/tos/download?file=nonexistent.txt');
      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('NOT_FOUND');
      expect(response.body.error.message).toContain('File');
      expect(response.body.error.message).toContain('nonexistent.txt');
    });

    it('should handle path traversal attempts', async () => {
      const response = await request(app).get('/tos/download?file=../../etc/passwd');
      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('GET /tos/version', () => {
    it('should return current ToS version information', async () => {
      const response = await request(app).get('/tos/version');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        version: '2.1.0',
        effectiveDate: '2025-01-15',
        lastUpdated: '2025-01-10',
      });
    });
  });
});
