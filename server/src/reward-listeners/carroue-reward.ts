import { RewardListener } from "../listeners";
import { setCarroueHolder } from "../carroue-holder";

export const CarroueReward: RewardListener = async function ({
  rewardId,
  socket,
  user,
}) {
  if (rewardId === "d1bc0a5c-350f-4d56-aebb-ea6066ad306a") {
    socket.emit("playVideo", {
      fileName: `tourne.mp4`,
      times: 1,
    });
    socket.emit("showCarroue", true);
    setCarroueHolder(user, false);
  }
};
