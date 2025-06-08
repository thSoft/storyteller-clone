import { alessio, donMarcello, inspectorRinaldi, vincenzo } from "../characters";
import { panel } from "../panelUtil";
import { confiscate } from "../scenes/confiscate";
import { disclose } from "../scenes/disclose";
import { eavesdrop } from "../scenes/eavesdrop";
import { orderHit } from "../scenes/orderHit";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { arrestedForMurder } from "./arrestedForMurder";

export const failedHit: Puzzle = {
  id: "failedHit",
  title: "Failed Hit",
  prompt: "Fired for Failed Hit",
  scenes: [...arrestedForMurder.scenes, confiscate.id],
  characters: [...arrestedForMurder.characters],
  isWinning: (state) => !state.getState(alessio.id, "dead") && state.getState(vincenzo.id, "fired") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 4,
  dependsOn: [arrestedForMurder.id],
  solutions: [
    [
      panel(eavesdrop, inspectorRinaldi),
      panel(orderHit, donMarcello, vincenzo),
      panel(confiscate, inspectorRinaldi, vincenzo),
      panel(disclose, vincenzo, donMarcello),
    ],
  ],
};
