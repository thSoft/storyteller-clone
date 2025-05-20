import { lucia, mafiaCharacters, nico, vincenzo } from "../characters";
import { mafiaScenes } from "../scenes";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { vincenzoTakesOver } from "./vincenzoTakesOver";

export const luciaTakesOver: Puzzle = {
  id: "luciaTakesOver",
  title: "Lucia Takes Over",
  prompt: "Nico Disowned, Vincenzo Betrayed, Lucia Takes Over",
  scenes: mafiaScenes,
  characters: mafiaCharacters,
  isWinning: (state) =>
    state.getState(lucia.id, "headOfFamily") === true &&
    state.getState(nico.id, "disowned") === true &&
    state.getState(vincenzo.id, "arrested") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 10,
  dependsOn: vincenzoTakesOver.id,
};
