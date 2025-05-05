import { alessio, inspectorRinaldi, vincenzo } from "../characters";
import { confiscate } from "../scenes/confiscate";
import { eavesdrop } from "../scenes/eavesdrop";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { successfulHeist } from "./successfulHeist";

export const failedHit: Puzzle = {
  id: "failedHit",
  title: "Failed Hit",
  prompt: "Fired for Failed Hit",
  scenes: [...successfulHeist.scenes, eavesdrop.id, confiscate.id],
  characters: [...successfulHeist.characters, inspectorRinaldi.id],
  isWinning: (state) => !state.getState(alessio.id, "dead") && state.getState(vincenzo.id, "fired") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 4,
  dependsOn: successfulHeist.id,
};
