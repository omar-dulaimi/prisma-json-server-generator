import { describe, it, expect } from 'vitest';
import { generateRandomNumber } from '../src/helpers';

describe('helpers', () => {
  describe('generateRandomNumber', () => {
    it('should return a number within the specified range', () => {
      const max = 100;
      const result = generateRandomNumber(max);
      
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(max);
      expect(Number.isInteger(result)).toBe(true);
    });

    it('should return 0 for max of 1', () => {
      const result = generateRandomNumber(1);
      expect(result).toBe(0);
    });

    it('should handle edge case of max 0', () => {
      const result = generateRandomNumber(0);
      expect(result).toBe(0);
    });
  });
});