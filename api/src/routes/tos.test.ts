import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import tosRouter from './tos';
import { errorHandler } from '../utils/errors';

let app: express.Express;

describe('Terms of Service API', () => {
  beforeEach(() => {
    app = express();
    app.use('/api/tos', tosRouter);
    app.use(errorHandler);
  });

  it('returns the requested ToS file contents', async () => {
    const response = await request(app)
      .get('/api/tos/download')
      .query({ file: 'terms-of-service.txt' });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/plain');
    expect(response.text).toContain('OctoCAT Supply Chain Management Terms of Service');
  });

  it('returns 400 when the file query parameter is missing', async () => {
    const response = await request(app).get('/api/tos/download');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation error: Missing or invalid file parameter',
      },
    });
  });

  it('returns 400 when the file query parameter attempts path traversal', async () => {
    const response = await request(app)
      .get('/api/tos/download')
      .query({ file: '../package.json' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation error: Invalid file parameter',
      },
    });
  });

  it('returns 404 when the requested ToS file does not exist', async () => {
    const response = await request(app)
      .get('/api/tos/download')
      .query({ file: 'missing-tos.txt' });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: {
        code: 'NOT_FOUND',
        message: 'File with ID missing-tos.txt not found',
      },
    });
  });

  it('returns the current ToS version metadata', async () => {
    const response = await request(app).get('/api/tos/version');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      version: '2.1.0',
      effectiveDate: '2025-01-15',
      lastUpdated: '2025-01-10',
    });
  });
});
