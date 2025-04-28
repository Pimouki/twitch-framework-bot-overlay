"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewardListeners = exports.commandListeners = void 0;
const medias_commands_1 = require("./command-listeners/medias-commands");
const tts_commands_1 = require("./command-listeners/tts-commands");
const spotify_commands_1 = require("./command-listeners/spotify-commands");
const help_commands_1 = require("./command-listeners/help-commands");
const spotify_commands_2 = require("./reward-listeners/spotify-commands");
const coucou_commands_1 = require("./reward-listeners/coucou-commands");
const chant_ia_commands_1 = require("./reward-listeners/chant-ia-commands");
const skip_commands_1 = require("./reward-listeners/skip-commands");
exports.commandListeners = [
    help_commands_1.HelpCommands,
    tts_commands_1.TtsCommands,
    medias_commands_1.MediaCommands,
    spotify_commands_1.SpotifyCommands,
];
exports.rewardListeners = [
    spotify_commands_2.SpotifyRewardCommands,
    skip_commands_1.SkipRewardCommands,
    coucou_commands_1.CoucouRewardCommands,
    chant_ia_commands_1.ChantIaCommands,
];
