import { alessio, bruno, donMarcello, donRomano, inspectorRinaldi, mafiaCharacters, vincenzo } from "../characters";
import { panel } from "../panelUtil";
import { mafiaScenes } from "../scenes";
import { arrest } from "../scenes/arrest";
import { eavesdrop } from "../scenes/eavesdrop";
import { impersonate } from "../scenes/impersonate";
import { orderHeist } from "../scenes/orderHeist";
import { orderHit } from "../scenes/orderHit";
import { robTheBank } from "../scenes/robTheBank";
import { shoot } from "../scenes/shoot";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { vincenzoTakesOver } from "./vincenzoTakesOver";

export const framing: Puzzle = {
  id: "framing",
  title: "Framing",
  prompt: "Framing a Rival",
  scenes: mafiaScenes,
  characters: mafiaCharacters,
  isWinning: (state) => {
    const bankRobberId = state.getGlobalState("bankRobber")?.id;
    if (bankRobberId) {
      return (
        !state.getState(bankRobberId, "arrested") &&
        state.getCharacterIds((characterId, attributes) => characterId !== bankRobberId && attributes.arrested === true)
          .length > 0
      );
    }
    const murdererIds = state.getRelations("killed").map(({ source }) => source);
    return (
      murdererIds.every((id) => !state.getState(id, "arrested")) &&
      state.getCharacterIds(
        (characterId, attributes) => !murdererIds.includes(characterId) && attributes.arrested === true
      ).length > 0
    );
  },
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 5,
  dependsOn: [vincenzoTakesOver.id],
  solutions: [
    [
      panel(orderHit, donMarcello, vincenzo),
      panel(impersonate, vincenzo, bruno),
      panel(eavesdrop, inspectorRinaldi),
      panel(shoot, vincenzo, alessio),
      panel(arrest, inspectorRinaldi, bruno),
    ],
    [
      panel(orderHeist, donRomano, bruno),
      panel(impersonate, bruno, vincenzo),
      panel(eavesdrop, inspectorRinaldi),
      panel(robTheBank, bruno),
      panel(arrest, inspectorRinaldi, vincenzo),
    ],
  ],
};
