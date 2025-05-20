import { alessio, inspectorRinaldi, mafiaCharacters } from "../characters";
import { mafiaScenes } from "../scenes";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { vincenzoTakesOver } from "./vincenzoTakesOver";

export const avoidingArrest: Puzzle = {
  id: "avoidingArrest",
  title: "Avoiding Arrest",
  prompt: "Avoiding Arrest via Staged Death",
  scenes: mafiaScenes,
  characters: mafiaCharacters,
  isWinning: (state) =>
    state.getGlobalState("bankRobber")?.id === alessio.id &&
    !state.getState(alessio.id, "arrested") &&
    state.getState(alessio.id, "dead", inspectorRinaldi.id) === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 7,
  dependsOn: vincenzoTakesOver.id,
};
