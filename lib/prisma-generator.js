"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const sdk_1 = require("@prisma/sdk");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const faker_1 = require("@faker-js/faker");
const lowdb_1 = require("./lowdb");
const removeDir_1 = __importDefault(require("./utils/removeDir"));
const config_1 = require("./config");
const helpers_1 = require("./helpers");
async function generate(options) {
    const outputDir = (0, sdk_1.parseEnvValue)(options.generator.output);
    const results = config_1.configSchema.safeParse(options.generator.config);
    if (!results.success)
        throw new Error('Invalid options passed');
    const config = results.data;
    await fs_1.promises.mkdir(outputDir, { recursive: true });
    await (0, removeDir_1.default)(outputDir, true);
    const prismaClientProvider = options.otherGenerators.find((it) => (0, sdk_1.parseEnvValue)(it.provider) === 'prisma-client-js');
    const prismaClientPath = (0, sdk_1.parseEnvValue)(prismaClientProvider === null || prismaClientProvider === void 0 ? void 0 : prismaClientProvider.output);
    const prismaClientDmmf = (await Promise.resolve().then(() => __importStar(require(prismaClientPath))))
        .dmmf;
    const adapter = new lowdb_1.JSONFileSync(path_1.default.join(outputDir, config.outputFileName));
    const db = new lowdb_1.LowSync(adapter);
    const defaultDBvalue = {};
    prismaClientDmmf.mappings.modelOperations.forEach((modelOp) => {
        defaultDBvalue[modelOp.plural] = [];
    });
    db.read();
    db.data = defaultDBvalue;
    db.write();
    const modelsPlural = prismaClientDmmf.mappings.modelOperations.reduce((result, current) => {
        const modelName = current.model.toLowerCase();
        result[modelName] = current.plural;
        return result;
    }, {});
    prismaClientDmmf.datamodel.models.forEach((model) => {
        const modelName = modelsPlural[model.name.toLowerCase()];
        const item = model.fields.reduce((result, current) => {
            switch (current.type) {
                case 'Int':
                    result[current.name] = faker_1.faker.datatype.number({ min: 1 });
                    break;
                case 'String':
                    if (current.name.includes('name')) {
                        result[current.name] = faker_1.faker.name.firstName();
                    }
                    else if (current.name.includes('email')) {
                        result[current.name] = faker_1.faker.internet.email();
                    }
                    else if (current.name.includes('title')) {
                        result[current.name] = faker_1.faker.name.jobType();
                    }
                    else {
                        result[current.name] = faker_1.faker.lorem.sentences(1);
                    }
                    break;
                case 'DateTime':
                    if (current.name.includes('create')) {
                        result[current.name] = faker_1.faker.date.past();
                    }
                    else if (current.name.includes('update')) {
                        result[current.name] = faker_1.faker.date.recent();
                    }
                    else {
                        result[current.name] = faker_1.faker.datatype.datetime();
                    }
                    break;
                case 'Boolean':
                    result[current.name] = faker_1.faker.datatype.boolean();
                    break;
                default:
                    switch (current.kind) {
                        case 'enum': {
                            const foundEnum = prismaClientDmmf.datamodel.enums.find((item) => item.name === current.type);
                            const values = foundEnum.values.map((value) => value.name);
                            result[current.name] =
                                values[(0, helpers_1.generateRandomNumber)(values.length)];
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
exports.generate = generate;
//# sourceMappingURL=prisma-generator.js.map