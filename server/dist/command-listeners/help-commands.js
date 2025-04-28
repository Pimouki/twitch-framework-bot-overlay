"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpCommands = void 0;
const jcv_ts_utils_1 = require("jcv-ts-utils");
var pickRandomOne = jcv_ts_utils_1.ArrayUtils.pickRandomOne;
const HelpCommands = async ({ command, channel, chatBotClient, args, messageCount, }) => {
    if (messageCount % 5 === 0) {
        const rand = pickRandomOne(["Hihihi.", "J'aime les bits.", "Vivement qu'on me bits.", "Bonjours a vous tihihihi.", "Pourquoi je parle?.", "Ok pourquoi pas.", "ALLO.", "MESSAGE ULTRA IMPORTANT."]);
        await chatBotClient.say(channel, rand);
    }
    if (command === "discord") {
        const rand = pickRandomOne(["https://discord.com/invite/6r8JK6g", "Faux essaye encore", "CHOUCROUTE"]);
        await chatBotClient.say(channel, rand);
    }
    if (command === "kikiks") {
        const rand = pickRandomOne(["Mon meilleur amis", "Le plus beau des viewers , merveilleuse personne , mon meilleur ami de la vie et super fort dans les jeux video."]);
        await chatBotClient.say(channel, rand);
    }
};
exports.HelpCommands = HelpCommands;
