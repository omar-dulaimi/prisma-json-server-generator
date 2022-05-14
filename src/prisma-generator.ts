import { DMMF as PrismaDMMF } from '@prisma/client/runtime';
import { parseEnvValue } from '@prisma/sdk';
import { EnvValue, GeneratorOptions } from '@prisma/generator-helper';
import { promises as fs } from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker';
import { LowSync, JSONFileSync } from './lowdb';
import removeDir from './utils/removeDir';
import { configSchema } from './config';
import { DefaultAdapter, Item, ModelsPlural } from './types';
import { generateRandomNumber } from './helpers';

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
  const adapter = new JSONFileSync(path.join(outputDir, config.outputFileName));
  const db = new LowSync(adapter);
  const defaultDBvalue: DefaultAdapter = {};
  prismaClientDmmf.mappings.modelOperations.forEach((modelOp) => {
    defaultDBvalue[modelOp.plural as string] = [];
  });

  db.read();
  db.data = defaultDBvalue;
  db.write();

  const modelsPlural = prismaClientDmmf.mappings.modelOperations.reduce(
    (result: ModelsPlural, current: PrismaDMMF.ModelMapping) => {
      const modelName = current.model.toLowerCase();
      result[modelName] = current.plural;
      return result;
    },
    {},
  );
  prismaClientDmmf.datamodel.models.forEach((model) => {
    const modelName = modelsPlural[model.name.toLowerCase()];
    const item = model.fields.reduce((result: Item, current) => {
      switch (current.type) {
        case 'Int':
          result[current.name] = faker.datatype.number({ min: 1 });
          break;

        case 'String':
          if (current.name.includes('name')) {
            result[current.name] = faker.name.firstName();
          } else if (current.name.includes('email')) {
            result[current.name] = faker.internet.email();
          } else if (current.name.includes('title')) {
            result[current.name] = faker.name.jobType();
          } else {
            result[current.name] = faker.lorem.sentences(1);
          }
          break;

        case 'DateTime':
          if (current.name.includes('create')) {
            result[current.name] = faker.date.past();
          } else if (current.name.includes('update')) {
            result[current.name] = faker.date.recent();
          } else {
            result[current.name] = faker.datatype.datetime();
          }
          break;

        case 'Boolean':
          result[current.name] = faker.datatype.boolean();
          break;
        default:
          switch (current.kind) {
            case 'enum': {
              const foundEnum = prismaClientDmmf.datamodel.enums.find(
                (item) => item.name === current.type,
              );
              const values = foundEnum.values.map((value) => value.name);
              result[current.name] =
                values[generateRandomNumber(values.length)];
            }
          }
      }
      return result;
    }, {});
    // @ts-ignore
    db.data[modelName].push(item);
    db.write();
  });
}
