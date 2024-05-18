import { RewardListener } from "../listeners";
import fs from "fs";

const readDir = async (dirname: string) : Promise<any>=> {
  return new Promise((resolve, reject) => {
    fs.readdir(dirname, (err, files) => { 
      if (err) {
        reject(err);
      }
      resolve(files);
    }) 
  });
}

export const ChantIaCommands: RewardListener = async ({
    channel,
    rewardTitle,
    rewardId,
    user,
    userId,
    message,
    chatBotClient, 
    chatBroadcasterClient, 
    apiClient,
    apiBotClient,
    socket,
    obs,
    spotify,
  }) => {
    if(rewardId !== "f8972cf9-43fe-47b2-9596-799409bf43f4"){
        return false;
    }
    const files = await readDir(`${__dirname}/../../../overlay/public/sounds/ia`);
    const musicFileIndex = Math.floor(Math.random() * (files.length - 1));
    const fileName = `ia/${files[musicFileIndex]}`;
    
    socket.emit("playSound", {
      fileName: fileName,
      times: 1,
    });

    return true;
};
