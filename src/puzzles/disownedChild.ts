import { donRomano } from "../characters";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { failedHit } from "./failedHit";

export const disownment: Puzzle = {
  id: "disownment",
  title: "Disowned Child",
  prompt: "Disowned Child",
  scenes: [...failedHit.scenes],
  characters: [...failedHit.characters],
  isWinning: (state) => state.getState(donRomano.id, "disowned") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 3,
  dependsOn: failedHit.id,
};
