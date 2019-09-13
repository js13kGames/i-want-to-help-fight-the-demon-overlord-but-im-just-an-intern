import { GenModel } from '../model/genmodel';
import { Level } from './level';

export let currentLevel: LevelObject;
export let nextLevel: number | undefined;
export let entranceDirection: number = -1;

export interface LevelObject {
  levelModel: GenModel;
  level: Level;
  exits: (number | undefined)[];
  spawn(): void;
}

export function setLevel(newLevel: LevelObject, initial?: boolean): void {
  if (initial) {
    entranceDirection = -1;
  }
  nextLevel = -1;
  currentLevel = newLevel;
  newLevel.spawn();
}

export function setNextLevel(index: number): void {
  nextLevel = index;
}

export function exitLevel(direction: number): void {
  const exit = currentLevel.exits[direction];
  if (exit != null) {
    entranceDirection = direction ^ 2;
    setNextLevel(exit);
  }
}

export interface CampaignData {
  playerHealth: number;
  playerHealthMax: number;
}

export const initialCampaignData: CampaignData = {
  playerHealth: 10,
  playerHealthMax: 10,
};

export const campaignData: CampaignData = {} as CampaignData;