"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObsInit = void 0;
const obs_websocket_js_1 = __importDefault(require("obs-websocket-js"));
const configs_1 = require("../configs");
async function ObsInit() {
    const obs = new obs_websocket_js_1.default();
    await obs
        .connect(`ws://127.0.0.1:${configs_1.OBS_SOCKET_PORT}`, configs_1.OBS_SOCKET_PASSWORD)
        .catch((err) => console.log("obs not connected", err));
    return obs;
}
exports.ObsInit = ObsInit;
