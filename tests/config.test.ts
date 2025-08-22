import { describe, it, expect } from 'vitest';
import { configSchema } from '../src/config';

describe('config', () => {
  describe('configSchema', () => {
    it('should validate valid config with outputFileName', () => {
      const validConfig = { outputFileName: 'custom.json' };
      const result = configSchema.parse(validConfig);
      
      expect(result.outputFileName).toBe('custom.json');
    });

    it('should use default outputFileName when not provided', () => {
      const emptyConfig = {};
      const result = configSchema.parse(emptyConfig);
      
      expect(result.outputFileName).toBe('db.json');
    });

    it('should reject invalid config with non-string outputFileName', () => {
      const invalidConfig = { outputFileName: 123 };
      
      expect(() => configSchema.parse(invalidConfig)).toThrow();
    });
  });
});