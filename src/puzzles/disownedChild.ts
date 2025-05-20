import { lucia } from "../characters";
import { disown } from "../scenes/disown";
import { fallInLove } from "../scenes/fallInLove";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { stagedDeath } from "./stagedDeath";

export const disownment: Puzzle = {
  id: "disownment",
  title: "Disowned Child",
  prompt: "Disowned Child",
  scenes: [...stagedDeath.scenes, fallInLove.id, disown.id],
  characters: [...stagedDeath.characters, lucia.id],
  isWinning: (state) => state.getState(lucia.id, "disowned") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 3,
  dependsOn: [stagedDeath.id],
};
