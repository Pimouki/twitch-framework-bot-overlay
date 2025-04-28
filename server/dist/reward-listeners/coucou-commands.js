"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoucouRewardCommands = void 0;
const CoucouRewardCommands = async ({ channel, rewardTitle, rewardId, user, userId, message, chatBotClient, chatBroadcasterClient, apiClient, apiBotClient, socket, obs, spotify, }) => {
    if (rewardId !== "68497a1b-283b-47c9-be07-25abf4624c9e") {
        return false;
    }
    socket.emit("playSound", {
        fileName: "coucou.mp3",
        times: 1,
    });
    return true;
};
exports.CoucouRewardCommands = CoucouRewardCommands;
