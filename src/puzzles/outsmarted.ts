import { donMarcello } from "../characters";
import { impersonate } from "../scenes/impersonate";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { disownment } from "./disownedChild";

export const outsmarted: Puzzle = {
  id: "outsmarted",
  title: "Outsmarted",
  prompt: "Shocked by Gun in Rival's Hands",
  scenes: [...disownment.scenes, impersonate.id],
  characters: [...disownment.characters],
  isWinning: (state) => state.getState(donMarcello.id, "shockedByGun") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 4,
  dependsOn: disownment.id,
};
