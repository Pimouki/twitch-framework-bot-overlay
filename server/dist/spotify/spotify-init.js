"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spotifyInit = exports.refreshToken = exports.getAuthHeader = exports.setSpotifyCode = void 0;
const configs_1 = require("../configs");
const fs_1 = require("fs");
const crypto = require("node:crypto");
const { URL } = require("node:url");
const open = require("open");
let _spotifyCode;
const spotifyAccountUri = "https://accounts.spotify.com";
const spotifyApiUri = "https://api.spotify.com/v1";
const setSpotifyCode = (code) => {
    _spotifyCode = code;
};
exports.setSpotifyCode = setSpotifyCode;
async function getToken() {
    return JSON.parse(await fs_1.promises.readFile(`./${configs_1.STORAGE_FOLDER}/spotify_token.json`, {
        encoding: "utf-8",
    }));
}
async function saveToken(token) {
    token.obtained_at = Date.now();
    return await fs_1.promises.writeFile(`./${configs_1.STORAGE_FOLDER}/spotify_token.json`, JSON.stringify(token, null, 4), "utf-8");
}
const getSpotifyCode = () => new Promise((resolve) => {
    const intervalRef = setInterval(() => {
        if (_spotifyCode) {
            clearInterval(intervalRef);
            resolve(_spotifyCode);
        }
    }, 1000);
});
const makeFormBody = (obj) => {
    const formBody = Object.keys(obj).map((key) => {
        const encodedKey = encodeURIComponent(key);
        const encodedValue = encodeURIComponent(obj[key]);
        return encodedKey + "=" + encodedValue;
    });
    return formBody.join("&");
};
async function getAuthHeader() {
    const token = await getToken();
    return {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.access_token}`,
    };
}
exports.getAuthHeader = getAuthHeader;
async function refreshToken(token) {
    const refreshToken = await fetch(`${spotifyAccountUri}/api/token`, {
        method: "POST",
        body: makeFormBody({
            grant_type: "refresh_token",
            refresh_token: token.refresh_token,
        }),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            Authorization: "Basic " +
                Buffer.from(configs_1.SPOTIFY_CLIENT + ":" + configs_1.SPOTIFY_SECRET).toString("base64"),
        },
    })
        .then((blob) => blob.json())
        .catch((err) => console.log(err));
    token.access_token = refreshToken.access_token;
    await saveToken(token);
}
exports.refreshToken = refreshToken;
async function spotifyInit() {
    let token;
    try {
        token = await getToken();
        await refreshToken(token);
    }
    catch (e) {
        const state = crypto.randomUUID();
        const scopes = "user-read-playback-state user-modify-playback-state user-read-currently-playing user-read-private";
        await open(`${spotifyAccountUri}/authorize?` +
            "response_type=code&" +
            `client_id=${configs_1.SPOTIFY_CLIENT}&` +
            `scope=${scopes}&` +
            `redirect_uri=${configs_1.SERVER_ADDRESS}/spotify&` +
            `state=${state}`);
        console.log("waiting for spotify authentification");
        const code = await getSpotifyCode();
        token = await (fetch(`${spotifyAccountUri}/api/token`, {
            method: "POST",
            body: makeFormBody({
                grant_type: "authorization_code",
                code,
                redirect_uri: `${configs_1.SERVER_ADDRESS}/spotify`,
            }),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                Authorization: "Basic " +
                    Buffer.from(configs_1.SPOTIFY_CLIENT + ":" + configs_1.SPOTIFY_SECRET).toString("base64"),
            },
        })
            .then((blob) => blob.json())
            .catch((err) => console.log(err)));
        await saveToken(token);
    }
    console.log("Spotify success authentification");
    setInterval(async () => {
        console.log("Spotify refresh token");
        await refreshToken(await getToken());
    }, 3500 * 1000);
    const getCurrentPlay = (async () => {
        return (fetch(`${spotifyApiUri}/me/player/currently-playing`, {
            headers: await getAuthHeader(),
        }).then((blob) => blob.json()));
    });
    const skipPlayer = async () => {
        fetch(`${spotifyApiUri}/me/player/next`, {
            headers: await getAuthHeader(),
            method: "POST",
        })
            .then((blob) => blob.json())
            .catch(() => { });
    };
    const searchTrack = async (search) => {
        const response = await fetch(`${spotifyApiUri}/search?q=${encodeURIComponent(search)}&type=track&limit=1`, { headers: await getAuthHeader() });
        if (!response.ok) {
            console.error(`Erreur HTTP ${response.status}: ${response.statusText}`);
            const errorText = await response.text();
            console.error(errorText);
            throw new Error(`Fetch échoué avec le code ${response.status}`);
        }
        const data = await response.json();
        return data;
    };
    const addQueue = async (search) => {
        let find;
        try {
            const url = new URL(search);
            const trackId = url.pathname.replace("/track/");
            find = await (fetch(`${spotifyApiUri}/tracks/${trackId}`, {
                headers: await getAuthHeader(),
                method: "POST",
            }).then((blob) => blob.json()));
        }
        catch (e) {
            const track = await searchTrack(search);
            if (!(track.tracks && track.tracks.items.length)) {
                throw new Error("Not found");
            }
            find = track.tracks.items[0];
        }
        if (!find) {
            throw new Error("Not found");
        }
        await fetch(`${spotifyApiUri}/me/player/queue?` + `uri=${find.uri}`, {
            headers: await getAuthHeader(),
            method: "POST",
        });
        return find;
    };
    // return { getCurrentPlay, skipPlayer, addQueue };
    return { getCurrentPlay, skipPlayer, addQueue };
}
exports.spotifyInit = spotifyInit;
