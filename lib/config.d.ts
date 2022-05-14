import { z } from 'zod';
export declare const configSchema: z.ZodObject<{
    outputFileName: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    outputFileName?: string;
}, {
    outputFileName?: string;
}>;
export declare type Config = z.infer<typeof configSchema>;
