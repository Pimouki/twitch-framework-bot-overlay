"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwurpleInit = exports.setTwitchCode = void 0;
const auth_1 = require("@twurple/auth");
const open = require("open");
const configs_1 = require("../configs");
const fs_1 = require("fs");
const api_1 = require("@twurple/api");
const chat_1 = require("@twurple/chat");
const eventsub_ws_1 = require("@twurple/eventsub-ws");
const pubsub_1 = require("@twurple/pubsub");
let _twitchCode;
const setTwitchCode = (code) => {
    _twitchCode = code;
};
exports.setTwitchCode = setTwitchCode;
const getTwitchCode = () => new Promise((resolve) => {
    const intervalRef = setInterval(() => {
        if (_twitchCode) {
            clearInterval(intervalRef);
            resolve(_twitchCode);
        }
    }, 1000);
});
async function getToken(userId) {
    return JSON.parse(await fs_1.promises.readFile(`./${configs_1.STORAGE_FOLDER}/twurple_token_${userId}.json`, {
        encoding: "utf-8",
    }));
}
async function saveToken(token, userId) {
    console.log(token);
    return await fs_1.promises.writeFile(`./${configs_1.STORAGE_FOLDER}/twurple_token_${userId}.json`, JSON.stringify(token, null, 4), "utf-8");
}
async function refresh(clientId, clientSecret, userId) {
    const provider = new auth_1.RefreshingAuthProvider({
        clientId,
        clientSecret,
    });
    provider.onRefresh((userId, token) => saveToken(token, userId));
    return provider;
}
async function TwurpleInit(clientId, clientSecret, userId) {
    let token;
    try {
        token = await getToken(userId);
    }
    catch (e) {
        await open("https://id.twitch.tv/oauth2/authorize?" +
            `client_id=${clientId}&` +
            `redirect_uri=${configs_1.SERVER_ADDRESS}/twurple&` +
            "response_type=code&" +
            "scope=" +
            "chat:read+" +
            "chat:edit+" +
            "channel:moderate+" +
            "channel:manage:broadcast+" +
            "channel:manage:predictions+" +
            "channel:read:predictions+" +
            "channel:manage:polls+" +
            "channel:manage:redemptions+" +
            "channel:read:redemptions+" +
            "channel:manage:vips+" +
            "user:manage:whispers+" +
            "channel:read:redemptions");
        console.log("waiting for twitch authentification");
        const code = await getTwitchCode();
        const response = await fetch("https://id.twitch.tv/oauth2/token?" +
            `client_id=${clientId}&` +
            `client_secret=${clientSecret}&` +
            `code=${code}&` +
            "grant_type=authorization_code&" +
            `redirect_uri=${configs_1.SERVER_ADDRESS}/twurple`, { method: "POST" });
        const responseToken = (await response.json());
        token = {
            scope: responseToken.scope,
            expiresIn: responseToken.expires_in,
            accessToken: responseToken.access_token,
            refreshToken: responseToken.refresh_token,
            obtainmentTimestamp: new Date().getDate(),
        };
        await saveToken(token, userId);
    }
    const authProvider = await refresh(clientId, clientSecret, userId);
    console.log("auth SuccessFull");
    authProvider.addUser(userId, token, ["chat"]);
    const apiClient = new api_1.ApiClient({ authProvider });
    const chatClient = new chat_1.ChatClient({
        authProvider,
        channels: [configs_1.TWITCH_CHANNEL],
    });
    await chatClient.connect();
    const eventSub = new eventsub_ws_1.EventSubWsListener({ apiClient });
    await eventSub.start();
    const pubSubClient = new pubsub_1.PubSubClient({ authProvider });
    console.log("connected to twitch");
    return {
        eventSub,
        chatClient,
        apiClient,
        pubSubClient,
    };
}
exports.TwurpleInit = TwurpleInit;
