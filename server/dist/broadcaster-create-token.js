"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = require("./configs");
const server_1 = require("./server");
const twurple_init_1 = require("./twurple/twurple-init");
server_1.httpServer.listen(configs_1.SERVER_PORT);
(0, twurple_init_1.TwurpleInit)(configs_1.TWITCH_BROADCASTER_CLIENT, configs_1.TWITCH_BROADCASTER_SECRET, configs_1.TWITCH_BROADCASTER_ID).then(() => {
    console.log("broadcaster token  created !");
    process.exit(0);
});
