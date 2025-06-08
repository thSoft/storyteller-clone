import { alessio, donMarcello, donRomano, inspectorRinaldi, mafiaCharacters, vincenzo } from "../characters";
import { panel } from "../panelUtil";
import { mafiaScenes } from "../scenes";
import { disclose } from "../scenes/disclose";
import { eavesdrop } from "../scenes/eavesdrop";
import { orderHeist } from "../scenes/orderHeist";
import { orderHit } from "../scenes/orderHit";
import { robTheBank } from "../scenes/robTheBank";
import { shoot } from "../scenes/shoot";
import { wearArmor } from "../scenes/wearArmor";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { vincenzoTakesOver } from "./vincenzoTakesOver";

export const avoidingArrest: Puzzle = {
  id: "avoidingArrest",
  title: "Avoiding Arrest",
  prompt: "Avoiding Arrest via Staged Death",
  scenes: mafiaScenes,
  characters: mafiaCharacters,
  isWinning: (state) =>
    state.getGlobalState("bankRobber")?.id === alessio.id &&
    !state.getState(alessio.id, "arrested") &&
    state.getState(alessio.id, "dead", inspectorRinaldi.id) === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 7,
  dependsOn: [vincenzoTakesOver.id],
  solutions: [
    [
      panel(orderHeist, donRomano, alessio),
      panel(eavesdrop, inspectorRinaldi),
      panel(robTheBank, alessio),
      panel(orderHit, donMarcello, vincenzo),
      panel(wearArmor, alessio),
      panel(eavesdrop, inspectorRinaldi),
      panel(disclose, donRomano),
      panel(shoot, vincenzo, alessio),
    ],
  ],
  invalidSolutions: [[]],
};
