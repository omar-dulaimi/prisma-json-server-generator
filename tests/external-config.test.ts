import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { externalConfigSchema } from '../src/config';

describe('external config', () => {
  const testConfigDir = path.join(__dirname, '../test-configs');

  beforeEach(async () => {
    await fs.mkdir(testConfigDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await fs.rm(testConfigDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('externalConfigSchema', () => {
    it('should validate default config', () => {
      const config = externalConfigSchema.parse({});
      
      expect(config.outputFileName).toBe('db.json');
      expect(config.recordCounts).toEqual({});
      expect(config.customPatterns).toEqual({});
      expect(config.seedData.enabled).toBe(false);
      expect(config.seedData.seedDataPath).toBe('./seeds/');
      expect(config.seedData.generateAdditionalRecords).toBe(true);
    });

    it('should validate config with record counts', () => {
      const config = externalConfigSchema.parse({
        recordCounts: {
          User: 10,
          Post: 25
        }
      });
      
      expect(config.recordCounts).toEqual({
        User: 10,
        Post: 25
      });
    });

    it('should validate config with custom patterns', () => {
      const config = externalConfigSchema.parse({
        customPatterns: {
          'User.email': '{{internet.email}}',
          'Post.title': '{{lorem.words}}'
        }
      });
      
      expect(config.customPatterns).toEqual({
        'User.email': '{{internet.email}}',
        'Post.title': '{{lorem.words}}'
      });
    });

    it('should validate config with seed data settings', () => {
      const config = externalConfigSchema.parse({
        seedData: {
          enabled: true,
          seedDataPath: './custom-seeds/',
          generateAdditionalRecords: false
        }
      });
      
      expect(config.seedData.enabled).toBe(true);
      expect(config.seedData.seedDataPath).toBe('./custom-seeds/');
      expect(config.seedData.generateAdditionalRecords).toBe(false);
    });

    it('should reject negative record counts', () => {
      expect(() => externalConfigSchema.parse({
        recordCounts: { User: -1 }
      })).toThrow();
    });

    it('should accept zero record counts', () => {
      const config = externalConfigSchema.parse({
        recordCounts: { User: 0 }
      });
      
      expect(config.recordCounts.User).toBe(0);
    });
  });

  describe('JSON file operations', () => {
    it('should create and parse valid config file', async () => {
      const configData = {
        outputFileName: 'test.json',
        recordCounts: { User: 5, Post: 10 },
        customPatterns: { 'User.name': '{{person.firstName}}' },
        seedData: { enabled: true, seedDataPath: './test-seeds/' }
      };

      const configFile = path.join(testConfigDir, 'test-config.json');
      await fs.writeFile(configFile, JSON.stringify(configData, null, 2));
      
      const savedData = JSON.parse(await fs.readFile(configFile, 'utf-8'));
      const parsedConfig = externalConfigSchema.parse(savedData);
      
      expect(parsedConfig.outputFileName).toBe('test.json');
      expect(parsedConfig.recordCounts).toEqual({ User: 5, Post: 10 });
      expect(parsedConfig.customPatterns).toEqual({ 'User.name': '{{person.firstName}}' });
      expect(parsedConfig.seedData.enabled).toBe(true);
      expect(parsedConfig.seedData.seedDataPath).toBe('./test-seeds/');
    });
  });
});