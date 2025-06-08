import { alessio, donMarcello, inspectorRinaldi, vincenzo } from "../characters";
import { panel } from "../panelUtil";
import { arrest } from "../scenes/arrest";
import { eavesdrop } from "../scenes/eavesdrop";
import { orderHit } from "../scenes/orderHit";
import { shoot } from "../scenes/shoot";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { successfulHeist } from "./successfulHeist";

export const arrestedForMurder: Puzzle = {
  id: "arrestedForMurder",
  title: "Arrested for Murder",
  prompt: "Arrested for Murder",
  scenes: [...successfulHeist.scenes, eavesdrop.id, arrest.id],
  characters: [...successfulHeist.characters, inspectorRinaldi.id],
  isWinning: (state) =>
    state.areRelated(vincenzo.id, "killed", alessio.id) && state.getState(vincenzo.id, "arrested") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 4,
  dependsOn: [successfulHeist.id],
  solutions: [
    [
      panel(orderHit, donMarcello, vincenzo),
      panel(eavesdrop, inspectorRinaldi),
      panel(shoot, vincenzo, alessio),
      panel(arrest, inspectorRinaldi, vincenzo),
    ],
  ],
  invalidSolutions: [
    [
      panel(orderHit, donMarcello, vincenzo),
      panel(shoot, vincenzo, alessio),
      panel(arrest, inspectorRinaldi, vincenzo),
    ],
  ],
};
