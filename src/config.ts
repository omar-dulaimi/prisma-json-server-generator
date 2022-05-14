import { z } from 'zod';

export const configSchema = z.object({});

export type Config = z.infer<typeof configSchema>;
