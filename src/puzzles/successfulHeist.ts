import { bruno } from "../characters";
import { heist } from "../scenes/heist";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { successfulHit } from "./successfulHit";

export const successfulHeist: Puzzle = {
  id: "successfulHeist",
  title: "Successful Heist",
  prompt: "Robber Gets His Cut",
  scenes: [...successfulHit.scenes, heist.id],
  characters: [...successfulHit.characters, bruno.id],
  isWinning: (state) =>
    state.getGlobalState("bankRobber")?.id === bruno.id && state.getState(bruno.id, "rewarded") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 3,
  dependsOn: successfulHit.id,
};
