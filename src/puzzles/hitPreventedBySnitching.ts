import { donMarcello, mafiaCharacters, vincenzo } from "../characters";
import { mafiaScenes } from "../scenes";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { vincenzoTakesOver } from "./vincenzoTakesOver";

export const hitPreventedBySnitching: Puzzle = {
  id: "hitPreventedBySnitching",
  title: "Hit Prevented by Snitching",
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
  dependsOn: vincenzoTakesOver.id,
};
