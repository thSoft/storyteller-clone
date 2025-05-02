import { alessio, mafiaCharacters, vincenzo } from "../characters";
import { mafiaScenes } from "../scenes";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { vincenzoTakesOver } from "./vincenzoTakesOver";

export const revenge: Puzzle = {
  id: "revenge",
  title: "Revenge",
  prompt: "Don Romano Takes Revenge for Alessio",
  scenes: mafiaScenes,
  characters: mafiaCharacters,
  isWinning: (state) => state.getState(alessio.id, "dead") === true && state.getState(vincenzo.id, "dead") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 8,
  dependsOn: vincenzoTakesOver.id,
};
