"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChantIaCommands = void 0;
const fs_1 = __importDefault(require("fs"));
const readDir = async (dirname) => {
    return new Promise((resolve, reject) => {
        fs_1.default.readdir(dirname, (err, files) => {
            if (err) {
                reject(err);
            }
            resolve(files);
        });
    });
};
const ChantIaCommands = async ({ channel, rewardTitle, rewardId, user, userId, message, chatBotClient, chatBroadcasterClient, apiClient, apiBotClient, socket, obs, spotify, }) => {
    if (rewardId !== "f8972cf9-43fe-47b2-9596-799409bf43f4") {
        return false;
    }
    const files = await readDir(`${__dirname}/../../../overlay/public/sounds/ia`);
    const musicFileIndex = Math.floor(Math.random() * (files.length - 1));
    const fileName = `ia/${files[musicFileIndex]}`;
    socket.emit("playSound", {
        fileName: fileName,
        times: 1,
    });
    return true;
};
exports.ChantIaCommands = ChantIaCommands;
