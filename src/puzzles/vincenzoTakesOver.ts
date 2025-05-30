import { mafiaCharacters, vincenzo } from "../characters";
import { mafiaScenes } from "../scenes";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { stagedDeath } from "./stagedDeath";

export const vincenzoTakesOver: Puzzle = {
  id: "vincenzoTakesOver",
  title: "Vincenzo Takes Over",
  prompt: "Vincenzo Takes Over the Family",
  scenes: mafiaScenes,
  characters: mafiaCharacters,
  isWinning: (state) => state.getState(vincenzo.id, "headOfFamily") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 3,
  dependsOn: [stagedDeath.id],
};
