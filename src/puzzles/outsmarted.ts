import { donMarcello } from "../characters";
import { impersonate } from "../scenes/impersonate";
import { getState } from "../scenes/sceneUtils";
import { getInitialStoryState } from "../storyState";
import { Puzzle } from "../types";
import { disownment } from "./disownedChild";

export const outsmarted: Puzzle = {
  id: "outsmarted",
  title: "Outsmarted",
  prompt: "Shocked by Gun in Rival’s Hands",
  scenes: [...disownment.scenes, impersonate.id],
  characters: [...disownment.characters],
  isWinning: (state) => getState(state, donMarcello.id, "shockedByGun") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 4,
};
