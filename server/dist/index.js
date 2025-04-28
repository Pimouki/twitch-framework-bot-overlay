"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const configs_1 = require("./configs");
const medias_commands_1 = require("./command-listeners/medias-commands");
const twurple_init_1 = require("./twurple/twurple-init");
const obs_init_1 = require("./obs/obs-init");
const spotify_init_1 = require("./spotify/spotify-init");
const app_init_1 = require("./app-init");
fs_1.promises.mkdir(`./${configs_1.STORAGE_FOLDER}`).catch(() => { });
fs_1.promises.mkdir(configs_1.SOUNDS_PATH).catch(() => { });
(0, medias_commands_1.initMedias)().catch((reason) => {
    console.log(reason);
});
Promise.all([
    (0, twurple_init_1.TwurpleInit)(configs_1.TWITCH_BROADCASTER_CLIENT, configs_1.TWITCH_BROADCASTER_SECRET, configs_1.TWITCH_BROADCASTER_ID),
    (0, twurple_init_1.TwurpleInit)(configs_1.TWITCH_BOT_CLIENT, configs_1.TWITCH_BOT_SECRET, configs_1.TWITCH_BOT_ID),
    (0, obs_init_1.ObsInit)(),
    (0, spotify_init_1.spotifyInit)(),
])
    .then(app_init_1.appInit)
    .catch((reason) => console.log(reason));
