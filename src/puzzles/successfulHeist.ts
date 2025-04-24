import { bruno, donRomano } from "../characters";
import { heist } from "../scenes/heist";
import { getState } from "../scenes/sceneUtils";
import { getInitialStoryState } from "../storyState";
import { Puzzle } from "../types";
import { successfulHit } from "./successfulHit";

export const successfulHeist: Puzzle = {
  id: "successfulHeist",
  title: "Successful Heist",
  prompt: `A Successful Heist`,
  scenes: [...successfulHit.scenes, heist.id],
  characters: [...successfulHit.characters, bruno.id],
  isWinning: (state) =>
    state.graph.getAttribute("bankRobbed") === true && getState(state, donRomano.id, "content") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 3,
};
