import { bruno } from "../characters";
import { heist } from "../scenes/heist";
import { getState } from "../scenes/sceneUtils";
import { getInitialStoryState } from "../storyState";
import { Puzzle } from "../types";
import { successfulHit } from "./successfulHit";

export const successfulHeist: Puzzle = {
  id: "successfulHeist",
  title: "Successful Heist",
  prompt: "Robber Gets His Cut",
  scenes: [...successfulHit.scenes, heist.id],
  characters: [...successfulHit.characters, bruno.id],
  isWinning: (state) =>
    state.graph.getAttribute("bankRobbed") === true && getState(state, bruno.id, "rewarded") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 3,
};
