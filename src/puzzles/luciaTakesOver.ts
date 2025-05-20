import { lucia, mafiaCharacters, nico, vincenzo } from "../characters";
import { mafiaScenes } from "../scenes";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { avoidingArrest } from "./avoidingArrest";
import { failedHeist } from "./failedHeist";
import { framing } from "./framing";
import { hitPreventedBySnitching } from "./hitPreventedBySnitching";
import { revenge } from "./revenge";
import { savedByLove } from "./savedByLove";

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
  dependsOn: [hitPreventedBySnitching.id, savedByLove.id, failedHeist.id, framing.id, avoidingArrest.id, revenge.id],
};
