import { generatorHandler } from '@prisma/generator-helper';
import { generate } from './prisma-generator';

generatorHandler({
  onManifest: () => ({
    defaultOutput: './generated',
    prettyName: 'Prisma JSON Server Generator',
    requiresGenerators: ['prisma-client-js'],
  }),
  onGenerate: generate,
});
