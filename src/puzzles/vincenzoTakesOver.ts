import { donMarcello, inspectorRinaldi, mafiaCharacters, nico, vincenzo } from "../characters";
import { panel } from "../panelUtil";
import { mafiaScenes } from "../scenes";
import { die } from "../scenes/die";
import { recruit } from "../scenes/recruit";
import { takeOver } from "../scenes/takeover";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { stagedDeath } from "./stagedDeath";

export const vincenzoTakesOver: Puzzle = {
  id: "vincenzoTakesOver",
  title: "Vincenzo Takes Over",
  prompt: "Vincenzo Takes Over the Family Although Nico Is Alive",
  scenes: mafiaScenes,
  characters: mafiaCharacters,
  isWinning: (state) => state.getState(vincenzo.id, "headOfFamily") === true && !state.getState(nico.id, "dead"),
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 3,
  dependsOn: [stagedDeath.id],
  solutions: [
    [panel(recruit, inspectorRinaldi, nico), panel(die, donMarcello), panel(takeOver, vincenzo)],
    [panel(die, donMarcello), panel(recruit, inspectorRinaldi, nico), panel(takeOver, vincenzo)],
  ],
};
