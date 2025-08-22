import { z } from 'zod';

export const configSchema = z.object({
  outputFileName: z.string().default('db.json'),
  config: z.string().optional(), // Path to external config file
});

export const externalConfigSchema = z.object({
  outputFileName: z.string().default('db.json'),
  recordCounts: z.record(z.string(), z.number().min(0)).default({}),
  customPatterns: z.record(z.string(), z.string()).default({}),
  seedData: z.object({
    enabled: z.boolean().default(false),
    seedDataPath: z.string().default('./seeds/'),
    generateAdditionalRecords: z.boolean().default(true),
  }).default({
    enabled: false,
    seedDataPath: './seeds/',
    generateAdditionalRecords: true,
  }),
});

export type Config = z.infer<typeof configSchema>;
export type ExternalConfig = z.infer<typeof externalConfigSchema>;
