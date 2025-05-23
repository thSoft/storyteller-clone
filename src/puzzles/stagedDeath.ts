import { donMarcello } from "../characters";
import { wearArmor } from "../scenes/wearArmor";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { outsmarted } from "./outsmarted";

export const stagedDeath: Puzzle = {
  id: "stagedDeath",
  title: "Staged Death",
  prompt: "Seeing a Living Ghost",
  scenes: [...outsmarted.scenes, wearArmor.id],
  characters: [...outsmarted.characters],
  isWinning: (state) => state.getState(donMarcello.id, "shockedByAlive") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 5,
  dependsOn: [outsmarted.id],
};
