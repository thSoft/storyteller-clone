import { alessio, vincenzo } from "../characters";
import { arrest } from "../scenes/arrest";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { failedHit } from "./failedHit";

export const arrestedForMurder: Puzzle = {
  id: "arrestedForMurder",
  title: "Arrested for Murder",
  prompt: "Arrested for Murder",
  scenes: [...failedHit.scenes, arrest.id],
  characters: [...failedHit.characters],
  isWinning: (state) =>
    state.areRelated(vincenzo.id, "killed", alessio.id) && state.getState(vincenzo.id, "arrested") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 4,
  dependsOn: failedHit.id,
};
