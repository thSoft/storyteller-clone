import { donMarcello } from "../characters";
import { impersonate } from "../scenes/impersonate";
import { showGun } from "../scenes/showGun";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { arrestedForMurder } from "./arrestedForMurder";

export const outsmarted: Puzzle = {
  id: "outsmarted",
  title: "Outsmarted",
  prompt: "Shocked by Gun in Rival's Hands",
  scenes: [...arrestedForMurder.scenes, impersonate.id, showGun.id],
  characters: [...arrestedForMurder.characters],
  isWinning: (state) => state.getState(donMarcello.id, "shockedByGun") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 4,
  dependsOn: arrestedForMurder.id,
};
