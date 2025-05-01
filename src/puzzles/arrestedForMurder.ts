import { alessio, mafiaCharacters, vincenzo } from "../characters";
import { mafiaScenes } from "../scenes";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { vincenzoTakesOver } from "./vincenzoTakesOver";

export const arrestedForMurder: Puzzle = {
  id: "arrestedForMurder",
  title: "Arrested for Murder",
  prompt: "Arrested for Murder",
  scenes: mafiaScenes,
  characters: mafiaCharacters,
  isWinning: (state) =>
    state.areRelated(vincenzo.id, "killed", alessio.id) && state.getState(vincenzo.id, "arrested") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 4,
  dependsOn: vincenzoTakesOver.id,
};
