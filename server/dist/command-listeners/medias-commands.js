"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaCommands = exports.initMedias = void 0;
const fs_1 = require("fs");
const configs_1 = require("../configs");
const jcv_ts_utils_1 = require("jcv-ts-utils");
var pickRandomOne = jcv_ts_utils_1.ArrayUtils.pickRandomOne;
const groupedMedias = [];
const saveConnectedUsers = async (users) => {
    return fs_1.promises.writeFile(`./${configs_1.STORAGE_FOLDER}/connected-users.json`, JSON.stringify(users, null, 4), "utf-8");
};
saveConnectedUsers([]).then(() => {
    console.log("clear connected users");
});
const getConnectedUsers = async () => {
    try {
        return JSON.parse(await fs_1.promises.readFile(`./${configs_1.STORAGE_FOLDER}/connected-users.json`, {
            encoding: "utf-8",
        }));
    }
    catch (e) {
        return [];
    }
};
async function initMedias() {
    const scan = async (type) => {
        console.log(`scan ${type}`);
        const paths = {
            sounds: configs_1.SOUNDS_PATH,
            videos: configs_1.VIDEOS_PATH,
        };
        const files = await fs_1.promises.readdir(paths[type]);
        console.log(`${type} found files`, files.length);
        files.forEach((fileName, i) => {
            const pushGroupedMedia = (id) => {
                const findIndex = groupedMedias.findIndex((r) => r.id === id);
                if (findIndex >= 0) {
                    const find = groupedMedias[findIndex];
                    groupedMedias[findIndex] = {
                        ...find,
                        choices: [...find.choices, { fileName, type }],
                    };
                }
                else {
                    groupedMedias.push({ id, choices: [{ fileName, type }] });
                }
            };
            const match = fileName.match(/([a-z]+)[0-9]+\./i);
            pushGroupedMedia(match
                ? match[1].toLowerCase()
                : fileName.split(".").at(0)?.trim().toLowerCase() || i.toString());
        });
    };
    await scan("sounds").catch((e) => console.log(e));
    await scan("videos").catch((e) => console.log(e));
}
exports.initMedias = initMedias;
const channelMusic = "music";
const MediaCommands = async ({ command, args, socket, chatBotClient: chatClient, channel, obs, apiClient, apiBotClient, meta, user, userId, }) => {
    const playVideo = (filename, times) => {
        times = isNaN(times) ? 1 : times;
        times = times > 3 ? 3 : times;
        socket.emit("playVideo", {
            fileName: `${filename}`,
            times,
        });
    };
    const playSound = (fileName, times) => {
        times = isNaN(times) ? 1 : times;
        times = times > 3 ? 3 : times;
        socket.emit("playSound", {
            fileName,
            times,
        });
    };
    const connectedUser = await getConnectedUsers();
    if (!connectedUser.includes(user)) {
        playSound("tuturu.mp3", 1);
        await saveConnectedUsers([...connectedUser, user]);
    }
    if (!command)
        return;
    if (command === "so") {
        if (meta.userInfo.isMod || meta.userInfo.isBroadcaster) {
            if (!args[0])
                return;
            const getId = await apiClient.users.getUserByName(args[0]);
            if (!getId)
                return;
            const clips = await apiClient.clips.getClipsForBroadcaster(getId);
            const rand = pickRandomOne(clips.data);
            socket.emit("playClip", { id: rand.id, duration: rand.duration });
            const broadcaster = await rand.getBroadcaster();
            await chatClient.say(channel, `Ce clip provient de ${broadcaster.displayName}, allez voir sa chaine : https://www.twitch.tv/${broadcaster.name}`);
        }
    }
    if (command === "random") {
        const random = pickRandomOne(groupedMedias);
        const randomMedia = pickRandomOne(random.choices);
        if (randomMedia.type === "videos") {
            await playVideo(randomMedia.fileName, 1);
        }
        else {
            socket.emit("playSound", {
                fileName: randomMedia.fileName,
                times: 1,
            });
        }
        return;
    }
    if (command === "medias") {
        await chatClient.say(channel, `liste des medias: ${groupedMedias.map((m) => "!" + m.id).join(" ")}`);
        return;
    }
    if (command === "chain") {
        const choices = args
            .slice(0, 5)
            .map((arg) => groupedMedias.find((s) => s.id === arg))
            .filter((f) => !!f);
        socket.emit("playMultipleSound", choices.map((m) => pickRandomOne(m.choices)));
        return;
    }
    let times = parseInt(args[0]);
    const findRand = groupedMedias.find(({ id }) => id === command);
    if (findRand) {
        const randMedia = pickRandomOne(findRand.choices);
        if (randMedia.type === "sounds") {
            playSound(randMedia.fileName, times);
        }
        else {
            playVideo(randMedia.fileName, times);
        }
    }
};
exports.MediaCommands = MediaCommands;
