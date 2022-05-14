"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _TextFileSync_tempFilename, _TextFileSync_filename;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextFileSync = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class TextFileSync {
    constructor(filename) {
        _TextFileSync_tempFilename.set(this, void 0);
        _TextFileSync_filename.set(this, void 0);
        __classPrivateFieldSet(this, _TextFileSync_filename, filename, "f");
        __classPrivateFieldSet(this, _TextFileSync_tempFilename, path_1.default.join(path_1.default.dirname(filename), `.${path_1.default.basename(filename)}.tmp`), "f");
    }
    read() {
        let data;
        try {
            data = fs_1.default.readFileSync(__classPrivateFieldGet(this, _TextFileSync_filename, "f"), 'utf-8');
        }
        catch (e) {
            if (e.code === 'ENOENT') {
                return null;
            }
            throw e;
        }
        return data;
    }
    write(str) {
        fs_1.default.writeFileSync(__classPrivateFieldGet(this, _TextFileSync_tempFilename, "f"), str);
        fs_1.default.renameSync(__classPrivateFieldGet(this, _TextFileSync_tempFilename, "f"), __classPrivateFieldGet(this, _TextFileSync_filename, "f"));
    }
}
exports.TextFileSync = TextFileSync;
_TextFileSync_tempFilename = new WeakMap(), _TextFileSync_filename = new WeakMap();
//# sourceMappingURL=TextFileSync.js.map