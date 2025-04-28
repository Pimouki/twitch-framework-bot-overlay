"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpServer = void 0;
const http_1 = require("http");
const configs_1 = require("./configs");
const twurple_init_1 = require("./twurple/twurple-init");
const spotify_init_1 = require("./spotify/spotify-init");
exports.httpServer = (0, http_1.createServer)((req, res) => {
    const url = new URL(`${configs_1.SERVER_ADDRESS}${req.url || "/"}`);
    console.log(req.url);
    const searchCode = url.searchParams.get("code");
    if (req.url && req.url.startsWith("/twurple")) {
        if (searchCode)
            (0, twurple_init_1.setTwitchCode)(searchCode);
    }
    if (req.url && req.url.startsWith("/spotify")) {
        if (searchCode)
            (0, spotify_init_1.setSpotifyCode)(searchCode);
    }
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(`{"message": "ok"}`);
});
