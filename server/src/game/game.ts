import { promises as fs } from "fs";
import {
  GameData,
  Player,
  HeroStats,
  PlayerWithHeroStats,
} from "../../../shared/src/shared-game";
import { NumberUtils } from "jcv-ts-utils";
import { STORAGE_FOLDER } from "../configs";
const dataPath = `./${STORAGE_FOLDER}/game.json`;
const { scaleHyperTangent } = NumberUtils;

async function loadData(): Promise<GameData<Player>> {
  return JSON.parse(await fs.readFile(dataPath, { encoding: "utf-8" }));
}

async function saveData(data: GameData<Player>) {
  return await fs.writeFile(dataPath, JSON.stringify(data, null, 4), "utf-8");
}

const defaultPoints: HeroStats = {
  pv: 0,
  power: 0,
  speed: 0,
  dodge: 0,
  critic: 0,
};
const pointToStat = ({
  critic,
  speed,
  pv,
  power,
  dodge,
}: HeroStats): HeroStats => {
  return {
    critic: NumberUtils.round(scaleHyperTangent(critic, 100, 50, 5), 100),
    dodge: NumberUtils.round(scaleHyperTangent(dodge, 100, 50, 5), 100),
    power: NumberUtils.round(scaleHyperTangent(power, 100, 50, 2), 1),
    pv: NumberUtils.round(scaleHyperTangent(pv, 100, 200, 10), 1),
    speed: NumberUtils.round(scaleHyperTangent(speed, 100, 50, 5), 100),
  };
};

function calcLvl(points: HeroStats): number {
  return (
    Math.ceil(
      (Object.keys(points) as (keyof HeroStats)[]).reduce(
        (prev, curr) => prev + points[curr],
        0
      ) / 10
    ) + 1
  );
}

export class Game {
  players: Player[] = [];
  private storedPlayers: Player[] = [];

  constructor() {
    loadData()
      .then(({ players }) => {
        this.storedPlayers = players;
      })
      .catch(() => {
        this.saveGame();
      });
  }

  get state(): GameData<PlayerWithHeroStats> {
    return {
      players: this.players.map((p) => ({
        ...p,
        heroStats: pointToStat(p.points),
        level: calcLvl(p.points),
      })),
    };
  }

  saveGame() {
    saveData({ players: this.players })
      .then(() => {
        console.log("success save data");
      })
      .catch(() => {});
  }

  addPlayer(id: string, name: string) {
    if (this.players.some((p) => p.id === id)) return;
    const findStored = this.storedPlayers.find((p) => p.id === id);
    const newPlayer: Player = {
      id,
      name,
      points: defaultPoints,
    };
    if (!findStored) this.storedPlayers.push(newPlayer);
    this.players.push(findStored || newPlayer);
    this.saveGame();
  }
}
