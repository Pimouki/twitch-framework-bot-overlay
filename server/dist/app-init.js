"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appInit = void 0;
const configs_1 = require("./configs");
const jcv_ts_utils_1 = require("jcv-ts-utils");
const welcome_messages_1 = require("./welcome-messages");
const socket_clients_1 = require("./socket/socket-clients");
const alias_1 = require("./alias");
const listeners_1 = require("./listeners");
const socket_io_1 = require("socket.io");
const server_1 = require("./server");
const socket = new socket_io_1.Server(server_1.httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
server_1.httpServer.listen(configs_1.SERVER_PORT);
const usersBlacklist = ["moobot"].map((m) => m.toLowerCase());
let messageCount = 0;
async function appInit([{ chatClient: chatBroadcasterClient, apiClient, pubSubClient }, { chatClient: chatBotClient, apiClient: apiBotClient }, obs, spotify,]) {
    // quand la config est prête alors ca execute ca
    await chatBotClient.say(configs_1.TWITCH_CHANNEL, jcv_ts_utils_1.ArrayUtils.pickRandomOne(welcome_messages_1.OnOnlineMessage));
    socket.on("connection", (socket) => {
        (0, socket_clients_1.socketClients)({ socket, chatBroadcasterClient, chatBotClient });
    });
    chatBotClient.onMessage(async (channel, user, text, meta) => {
        if (meta.isRedemption)
            return;
        const userLower = user.toLowerCase();
        if (usersBlacklist.includes(userLower))
            return;
        const extractEmotes = meta
            .parseEmotes()
            .map((p) => (p.type === "text" ? p.text : ""));
        const parsedText = extractEmotes.join(" ");
        const [first, ...args] = parsedText.split(" ");
        let command = first.startsWith("")
            ? first.replace(/!/g, "").toLowerCase()
            : "";
        command = command.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        command = (0, alias_1.alias)(command);
        messageCount++;
        for (let i = 0; i < listeners_1.commandListeners.length; i++) {
            const cancelNext = await listeners_1.commandListeners[i]({
                channel,
                user: userLower,
                rawText: text,
                command,
                meta,
                parsedText,
                args: args.map((arg) => arg.toLowerCase()),
                chatBotClient,
                chatBroadcasterClient,
                apiClient,
                apiBotClient,
                userId: meta.userInfo.userId,
                socket,
                obs,
                spotify,
                messageCount: messageCount,
            }).catch((e) => console.error(e));
            if (typeof cancelNext === "boolean" && cancelNext)
                break;
        }
    });
    pubSubClient.onRedemption(configs_1.TWITCH_BROADCASTER_ID, async (message) => {
        const userLower = message.userName.toLowerCase();
        /*
         * Plutot que de boucler sur les fonctions et faire la vérif
         * Passer par un mapping de l'ID de la reward et la fonction
         *  {
         *    "REWARD_ID" : COMMANDFUNCTION
         *  }
         */
        for (let i = 0; i < listeners_1.rewardListeners.length; i++) {
            console.log("test");
            const cancelNext = await listeners_1.rewardListeners[i]({
                channel: configs_1.TWITCH_CHANNEL,
                user: userLower,
                rewardTitle: message.rewardTitle,
                rewardId: message.rewardId,
                userId: message.userId,
                message: message.message,
                chatBotClient,
                chatBroadcasterClient,
                apiClient,
                apiBotClient,
                socket,
                obs,
                spotify,
            }).catch((e) => console.error(e));
            if (typeof cancelNext === "boolean" && cancelNext)
                break;
        }
    });
    [
        "SIGHUP",
        "SIGINT",
        "SIGQUIT",
        "SIGILL",
        "SIGTRAP",
        "SIGABRT",
        "SIGBUS",
        "SIGFPE",
        "SIGUSR1",
        "SIGSEGV",
        "SIGUSR2",
        "SIGTERM",
    ].forEach((sig) => {
        process.on(sig, async () => {
            await chatBotClient.say(configs_1.TWITCH_CHANNEL, jcv_ts_utils_1.ArrayUtils.pickRandomOne(welcome_messages_1.OnExitMessage));
            process.exit(0);
        });
    });
}
exports.appInit = appInit;
