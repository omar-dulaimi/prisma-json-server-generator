import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { configSchema } from '../src/config';

describe('generator integration', () => {
  const testOutputDir = path.join(__dirname, '../test-output');

  beforeEach(async () => {
    await fs.mkdir(testOutputDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await fs.rm(testOutputDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('config validation', () => {
    it('should handle default config correctly', () => {
      const config = configSchema.parse({});
      expect(config.outputFileName).toBe('db.json');
    });

    it('should handle custom outputFileName', () => {
      const config = configSchema.parse({ outputFileName: 'custom.json' });
      expect(config.outputFileName).toBe('custom.json');
    });
  });

  describe('file operations', () => {
    it('should be able to create test directory', async () => {
      const testFile = path.join(testOutputDir, 'test.json');
      await fs.writeFile(testFile, JSON.stringify({ test: true }));
      
      const exists = await fs.access(testFile).then(() => true).catch(() => false);
      expect(exists).toBe(true);
      
      const content = JSON.parse(await fs.readFile(testFile, 'utf-8'));
      expect(content.test).toBe(true);
    });
  });
});