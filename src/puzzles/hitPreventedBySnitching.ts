import { alessio, bruno, donMarcello, donRomano, inspectorRinaldi, mafiaCharacters, vincenzo } from "../characters";
import { panel } from "../panelUtil";
import { mafiaScenes } from "../scenes";
import { confiscate } from "../scenes/confiscate";
import { disclose } from "../scenes/disclose";
import { eavesdrop } from "../scenes/eavesdrop";
import { orderHit } from "../scenes/orderHit";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { vincenzoTakesOver } from "./vincenzoTakesOver";

export const hitPreventedBySnitching: Puzzle = {
  id: "hitPreventedBySnitching",
  title: "Snitching",
  prompt: "Hit Prevented by Snitching",
  scenes: mafiaScenes,
  characters: mafiaCharacters,
  isWinning: (state) => {
    const gunOwnerId = state.getGlobalState("gunOwner")?.id;
    if (gunOwnerId === undefined) return false;
    const rivalAwareOfHitPlan = mafiaCharacters.some(
      (characterId) =>
        state.areRelated(vincenzo.id, "promisedMurderTo", donMarcello.id, characterId) &&
        !state.areRelated(characterId, "promisedMurderTo", donMarcello.id)
    );
    const gunConfiscatedByPolice = state.getState(gunOwnerId, "worksForPolice") === true;
    return rivalAwareOfHitPlan && gunConfiscatedByPolice;
  },
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 4,
  dependsOn: [vincenzoTakesOver.id],
  solutions: [
    [
      panel(eavesdrop, donRomano),
      panel(orderHit, donMarcello, vincenzo),
      panel(disclose, donRomano, inspectorRinaldi),
      panel(confiscate, inspectorRinaldi, vincenzo),
    ],
    [
      panel(eavesdrop, alessio),
      panel(orderHit, donMarcello, vincenzo),
      panel(disclose, alessio, inspectorRinaldi),
      panel(confiscate, inspectorRinaldi, vincenzo),
    ],
    [
      panel(eavesdrop, bruno),
      panel(orderHit, donMarcello, vincenzo),
      panel(disclose, bruno, inspectorRinaldi),
      panel(confiscate, inspectorRinaldi, vincenzo),
    ],
  ],
};
