import { alessio, vincenzo } from "../characters";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { successfulHeist } from "./successfulHeist";

export const failedHit: Puzzle = {
  id: "failedHit",
  title: "Failed Hit",
  prompt: "Failed Hit",
  scenes: [...successfulHeist.scenes],
  characters: [...successfulHeist.characters],
  isWinning: (state) =>
    state.getState(alessio.id, "dead") === false && state.getState(vincenzo.id, "promoted") === false,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 3,
  dependsOn: successfulHeist.id,
};
