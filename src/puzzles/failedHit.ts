import { alessio, inspectorRinaldi, vincenzo } from "../characters";
import { confrontation } from "../scenes/confrontation";
import { eavesdrop } from "../scenes/eavesdrop";
import { getState } from "../scenes/sceneUtils";
import { getInitialStoryState } from "../storyState";
import { Puzzle } from "../types";
import { successfulHeist } from "./successfulHeist";

export const failedHit: Puzzle = {
  id: "failedHit",
  title: "Failed Hit",
  prompt: "Fired for Failed Hit",
  scenes: [...successfulHeist.scenes, eavesdrop.id, confrontation.id],
  characters: [...successfulHeist.characters, inspectorRinaldi.id],
  isWinning: (state) => !getState(state, alessio.id, "dead") && getState(state, vincenzo.id, "fired") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 4,
};
