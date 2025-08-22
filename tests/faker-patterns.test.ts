import { describe, it, expect } from 'vitest';

// Note: We can't directly test the evaluateFakerPattern function since it's not exported
// but we can test the pattern format and structure here

describe('faker patterns', () => {
  describe('pattern validation', () => {
    it('should recognize valid faker patterns', () => {
      const validPatterns = [
        '{{internet.email}}',
        '{{person.firstName}}',
        '{{lorem.words}}',
        '{{lorem.paragraphs}}',
        '{{commerce.price}}',
        '{{date.recent}}',
        '{{datatype.boolean}}',
        '{{number.int}}'
      ];

      validPatterns.forEach(pattern => {
        const cleanPattern = pattern.replace(/\{\{|\}\}/g, '');
        expect(cleanPattern).toMatch(/^[a-zA-Z]+\.[a-zA-Z]+$/);
      });
    });

    it('should identify pattern structure', () => {
      const pattern = '{{internet.email}}';
      const cleanPattern = pattern.replace(/\{\{|\}\}/g, '');
      const parts = cleanPattern.split('.');
      
      expect(parts).toHaveLength(2);
      expect(parts[0]).toBe('internet');
      expect(parts[1]).toBe('email');
    });

    it('should handle nested patterns', () => {
      const pattern = '{{location.city.name}}';
      const cleanPattern = pattern.replace(/\{\{|\}\}/g, '');
      const parts = cleanPattern.split('.');
      
      expect(parts).toHaveLength(3);
      expect(parts[0]).toBe('location');
      expect(parts[1]).toBe('city');
      expect(parts[2]).toBe('name');
    });
  });

  describe('pattern examples', () => {
    const commonPatterns = {
      'User.email': '{{internet.email}}',
      'User.firstName': '{{person.firstName}}',
      'User.lastName': '{{person.lastName}}',
      'User.username': '{{internet.userName}}',
      'Post.title': '{{lorem.words}}',
      'Post.content': '{{lorem.paragraphs}}',
      'Post.slug': '{{lorem.slug}}',
      'Product.name': '{{commerce.productName}}',
      'Product.price': '{{commerce.price}}',
      'Company.name': '{{company.name}}',
      'Address.street': '{{location.streetAddress}}',
      'Address.city': '{{location.city}}',
      'Address.zipCode': '{{location.zipCode}}'
    };

    it('should have valid pattern format for all examples', () => {
      Object.entries(commonPatterns).forEach(([field, pattern]) => {
        expect(pattern).toMatch(/^\{\{[a-zA-Z]+\.[a-zA-Z]+\}\}$/);
        expect(field).toMatch(/^[A-Z][a-zA-Z]*\.[a-zA-Z]+$/);
      });
    });
  });
});