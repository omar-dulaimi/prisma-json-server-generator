import { parseEnvValue, getDMMF } from '@prisma/internals';
import type { DMMF as PrismaDMMF } from '@prisma/generator-helper';
import { EnvValue, GeneratorOptions } from '@prisma/generator-helper';
import { promises as fs } from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker';
import { LowSync, JSONFileSync } from './lowdb';
import removeDir from './utils/removeDir';
import { configSchema, externalConfigSchema, ExternalConfig } from './config';
import { DefaultAdapter, Item, ModelsPlural } from './types';
import { generateRandomNumber } from './helpers';

export async function generate(options: GeneratorOptions) {
  const outputDir = parseEnvValue(options.generator.output as EnvValue);
  const results = configSchema.safeParse(options.generator.config);
  if (!results.success) throw new Error('Invalid options passed');
  const config = results.data;
  
  // Load external config if specified
  let externalConfig: ExternalConfig = externalConfigSchema.parse({});
  if (config.config) {
    try {
      const configPath = path.resolve(config.config);
      const configFile = await fs.readFile(configPath, 'utf-8');
      const parsedConfig = JSON.parse(configFile);
      const configResult = externalConfigSchema.safeParse(parsedConfig);
      if (!configResult.success) {
        throw new Error(`Invalid external config: ${configResult.error.message}`);
      }
      externalConfig = configResult.data;
    } catch (error) {
      console.warn(`Failed to load external config from ${config.config}:`, error.message);
    }
  }
  
  await fs.mkdir(outputDir, { recursive: true });
  await removeDir(outputDir, true);

  const prismaClientProvider = options.otherGenerators.find(
    (it) => parseEnvValue(it.provider) === 'prisma-client-js',
  );

  const prismaClientDmmf = await getDMMF({
    datamodel: options.datamodel,
    previewFeatures: prismaClientProvider?.previewFeatures,
  });

  // Use external config filename if available, fallback to generator config
  const outputFileName = externalConfig.outputFileName || config.outputFileName;
  const adapter = new JSONFileSync(path.join(outputDir, outputFileName));
  const db = new LowSync(adapter);
  const defaultDBvalue: DefaultAdapter = {};
  
  // Create models plural mapping first
  const modelsPlural = prismaClientDmmf.mappings.modelOperations.reduce(
    (result: ModelsPlural, current: PrismaDMMF.ModelMapping) => {
      const modelName = current.model.toLowerCase();
      // Create simple plural form for JSON server
      const pluralName = modelName + 's';
      result[modelName] = pluralName;
      return result;
    },
    {},
  );

  // Load seed data if enabled
  if (externalConfig.seedData.enabled) {
    await loadSeedData(defaultDBvalue, externalConfig.seedData.seedDataPath);
  }
  
  // Initialize empty arrays for each model using correct plural names
  prismaClientDmmf.mappings.modelOperations.forEach((modelOp) => {
    const modelName = modelOp.model.toLowerCase();
    const pluralName = modelsPlural[modelName];
    if (!defaultDBvalue[pluralName]) {
      defaultDBvalue[pluralName] = [];
    }
  });

  db.read();
  db.data = defaultDBvalue;
  db.write();
  prismaClientDmmf.datamodel.models.forEach((model) => {
    const modelName = modelsPlural[model.name.toLowerCase()];
    let recordCount = externalConfig.recordCounts[model.name] || 1;
    
    // If seed data is enabled and we shouldn't generate additional records, skip generation
    if (externalConfig.seedData.enabled && !externalConfig.seedData.generateAdditionalRecords) {
      return;
    }
    
    // If seed data is enabled and we have existing seed records, adjust count
    if (externalConfig.seedData.enabled && externalConfig.seedData.generateAdditionalRecords) {
      // @ts-ignore
      const existingCount = db.data[modelName]?.length || 0;
      recordCount = Math.max(0, recordCount - existingCount);
    }
    
    // Generate specified number of records for each model
    for (let i = 0; i < recordCount; i++) {
      const item = generateRecord(model, prismaClientDmmf, externalConfig);
      // @ts-ignore
      db.data[modelName].push(item);
    }
    db.write();
  });
}

async function loadSeedData(defaultDBvalue: DefaultAdapter, seedDataPath: string) {
  try {
    const seedDir = path.resolve(seedDataPath);
    const files = await fs.readdir(seedDir);
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const modelName = file.replace('.json', '');
        const seedFile = path.join(seedDir, file);
        const seedContent = await fs.readFile(seedFile, 'utf-8');
        const seedData = JSON.parse(seedContent);
        
        if (Array.isArray(seedData)) {
          defaultDBvalue[modelName] = seedData;
        }
      }
    }
  } catch (error) {
    console.warn('Failed to load seed data:', error.message);
  }
}

function generateRecord(model: PrismaDMMF.Model, prismaClientDmmf: PrismaDMMF.Document, externalConfig: ExternalConfig): Item {
  return model.fields.reduce((result: Item, current) => {
    const fieldKey = `${model.name}.${current.name}`;
    
    // Check for custom pattern first
    if (externalConfig.customPatterns[fieldKey]) {
      result[current.name] = evaluateFakerPattern(externalConfig.customPatterns[fieldKey]);
      return result;
    }
    
    // Default generation logic
    switch (current.type) {
      case 'Int':
        result[current.name] = faker.number.int({ min: 1 });
        break;

      case 'String':
        if (current.name.includes('name')) {
          result[current.name] = faker.person.firstName();
        } else if (current.name.includes('email')) {
          result[current.name] = faker.internet.email();
        } else if (current.name.includes('title')) {
          result[current.name] = faker.person.jobType();
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
          result[current.name] = faker.date.anytime();
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
            result[current.name] = values[generateRandomNumber(values.length)];
            break;
          }
        }
    }
    return result;
  }, {});
}

function evaluateFakerPattern(pattern: string): any {
  // Remove mustache-style braces: {{internet.email}} -> internet.email
  const cleanPattern = pattern.replace(/\{\{|\}\}/g, '');
  
  try {
    // Split the pattern: internet.email -> ['internet', 'email']
    const parts = cleanPattern.split('.');
    
    // Navigate through faker object
    let fakerMethod: any = faker;
    for (const part of parts) {
      if (fakerMethod && typeof fakerMethod[part] !== 'undefined') {
        fakerMethod = fakerMethod[part];
      } else {
        throw new Error(`Invalid faker pattern: ${pattern}`);
      }
    }
    
    // Execute the faker method if it's a function
    if (typeof fakerMethod === 'function') {
      return fakerMethod();
    }
    
    return fakerMethod;
  } catch (error) {
    console.warn(`Failed to evaluate faker pattern "${pattern}":`, error.message);
    return faker.lorem.word(); // Fallback
  }
}
