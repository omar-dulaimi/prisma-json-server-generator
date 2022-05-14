import { z } from 'zod';

export const configSchema = z.object({
  outputFileName: z.string().default('db.json'),
});

export type Config = z.infer<typeof configSchema>;
