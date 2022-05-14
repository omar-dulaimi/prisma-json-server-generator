"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Low = void 0;
const MissingAdapterError_js_1 = require("./MissingAdapterError.js");
class Low {
    constructor(adapter) {
        this.data = null;
        if (adapter) {
            this.adapter = adapter;
        }
        else {
            throw new MissingAdapterError_js_1.MissingAdapterError();
        }
    }
    async read() {
        this.data = await this.adapter.read();
    }
    async write() {
        if (this.data) {
            await this.adapter.write(this.data);
        }
    }
}
exports.Low = Low;
//# sourceMappingURL=Low.js.map