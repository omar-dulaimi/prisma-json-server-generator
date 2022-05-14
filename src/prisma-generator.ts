import { DMMF as PrismaDMMF } from '@prisma/client/runtime';
import { parseEnvValue } from '@prisma/sdk';
import { EnvValue, GeneratorOptions } from '@prisma/generator-helper';
import { promises as fs } from 'fs';
import path from 'path';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import removeDir from './utils/removeDir';
import { configSchema } from './config';

export async function generate(options: GeneratorOptions) {
  const outputDir = parseEnvValue(options.generator.output as EnvValue);
  const results = configSchema.safeParse(options.generator.config);
  if (!results.success) throw new Error('Invalid options passed');
  const config = results.data;
  await fs.mkdir(outputDir, { recursive: true });
  await removeDir(outputDir, true);

  const prismaClientProvider = options.otherGenerators.find(
    (it) => parseEnvValue(it.provider) === 'prisma-client-js',
  );
  const prismaClientPath = parseEnvValue(
    prismaClientProvider?.output as EnvValue,
  );
  const prismaClientDmmf = (await import(prismaClientPath))
    .dmmf as PrismaDMMF.Document;
  const adapter = new FileSync(path.join(outputDir, 'db.json'));
  const db = low(adapter);

  const defaultDBvalue: { [name: string]: Array<any> } = {};
  prismaClientDmmf.mappings.modelOperations.forEach((modelOp) => {
    defaultDBvalue[modelOp.plural as string] = [];
  });

  db.defaults(defaultDBvalue).write();
}
