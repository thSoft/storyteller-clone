import { alessio, bruno, donMarcello, donRomano, inspectorRinaldi, mafiaCharacters, vincenzo } from "../characters";
import { panel } from "../panelUtil";
import { mafiaScenes } from "../scenes";
import { confiscate } from "../scenes/confiscate";
import { disclose } from "../scenes/disclose";
import { eavesdrop } from "../scenes/eavesdrop";
import { impersonate } from "../scenes/impersonate";
import { orderHit } from "../scenes/orderHit";
import { shoot } from "../scenes/shoot";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { vincenzoTakesOver } from "./vincenzoTakesOver";

export const revenge: Puzzle = {
  id: "revenge",
  title: "Revenge",
  prompt: "Don Romano Takes Revenge for Alessio",
  scenes: mafiaScenes,
  characters: mafiaCharacters,
  isWinning: (state) => state.getState(alessio.id, "dead") === true && state.getState(vincenzo.id, "dead") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 8,
  dependsOn: [vincenzoTakesOver.id],
  solutions: [
    [
      panel(orderHit, donMarcello, vincenzo),
      panel(eavesdrop, bruno),
      panel(shoot, vincenzo, alessio),
      panel(disclose, bruno, donRomano),
      panel(orderHit, donRomano, bruno),
      panel(impersonate, bruno, inspectorRinaldi),
      panel(confiscate, bruno, vincenzo),
      panel(shoot, bruno, vincenzo),
    ],
    [
      panel(eavesdrop, bruno),
      panel(orderHit, donMarcello, vincenzo),
      panel(eavesdrop, donRomano),
      panel(shoot, vincenzo, alessio),
      panel(orderHit, donRomano, bruno),
      panel(impersonate, bruno, inspectorRinaldi),
      panel(confiscate, bruno, vincenzo),
      panel(shoot, bruno, vincenzo),
    ],
  ],
};
