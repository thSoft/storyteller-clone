import { alessio, donMarcello, inspectorRinaldi, lucia, mafiaCharacters, nico, vincenzo } from "../characters";
import { panel } from "../panelUtil";
import { mafiaScenes } from "../scenes";
import { arrest } from "../scenes/arrest";
import { die } from "../scenes/die";
import { disclose } from "../scenes/disclose";
import { disown } from "../scenes/disown";
import { eavesdrop } from "../scenes/eavesdrop";
import { orderHit } from "../scenes/orderHit";
import { recruit } from "../scenes/recruit";
import { shoot } from "../scenes/shoot";
import { takeOver } from "../scenes/takeover";
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
  prompt: "Vincenzo Snitched by Disowned Nico, Lucia Takes Over",
  scenes: mafiaScenes,
  characters: mafiaCharacters,
  isWinning: (state) =>
    state.getState(lucia.id, "headOfFamily") === true &&
    state.getState(nico.id, "disowned") === true &&
    state.areRelated(vincenzo.id, "killed", alessio.id, nico.id) &&
    state.areRelated(vincenzo.id, "killed", alessio.id, inspectorRinaldi.id) &&
    state.getState(vincenzo.id, "arrested") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 10,
  dependsOn: [hitPreventedBySnitching.id, savedByLove.id, failedHeist.id, framing.id, avoidingArrest.id, revenge.id],
  solutions: [
    [
      panel(eavesdrop, donMarcello),
      panel(recruit, inspectorRinaldi, nico),
      panel(disown, donMarcello, nico),
      panel(orderHit, donMarcello, vincenzo),
      panel(eavesdrop, nico),
      panel(shoot, vincenzo, alessio),
      panel(disclose, nico, inspectorRinaldi),
      panel(arrest, inspectorRinaldi, vincenzo),
      panel(die, donMarcello),
      panel(takeOver, lucia),
    ],
    [
      panel(recruit, inspectorRinaldi, nico),
      panel(disclose, nico, donMarcello),
      panel(disown, donMarcello, nico),
      panel(orderHit, donMarcello, vincenzo),
      panel(eavesdrop, nico),
      panel(shoot, vincenzo, alessio),
      panel(disclose, nico, inspectorRinaldi),
      panel(arrest, inspectorRinaldi, vincenzo),
      panel(die, donMarcello),
      panel(takeOver, lucia),
    ],
  ],
};
