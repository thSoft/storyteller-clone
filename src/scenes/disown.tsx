import { characters } from "../characters";
import { Scene } from "../types";

const confronterSlot = { id: "confronter", label: "Confronter" };
const confrontedSlot = { id: "confronted", label: "Confronted" };

export const disown: Scene = {
  id: "disown",
  name: "Disown",
  slots: [confronterSlot, confrontedSlot],
  outcomeLogic: (state, assigned) => {
    const confronter = assigned[confronterSlot.id];
    const confronted = assigned[confrontedSlot.id];
    // If confronter is aware of the confronted loving someone who the confronter wants to kill,
    // and the confronted is child of the confronter, then disown the confronted
    const loverOfConfrontedIds = Array.from(
      new Set([
        ...state.getRelated(confronted.id, "loves", confronter.id),
        ...state.getRelatedBy(confronted.id, "loves", confronter.id),
      ])
    );
    const mortalEnemiesOfConfronterLoverOfConfrontedIds = loverOfConfrontedIds.filter((loverId) =>
      state.areRelated(confronter.id, "wantsToKill", loverId)
    );
    if (
      mortalEnemiesOfConfronterLoverOfConfrontedIds.length > 0 &&
      state.areRelated(confronted.id, "childOf", confronter.id)
    ) {
      state.setState(confronted.id, "disowned", true);
      state.setDescription(
        `${confronter.name} disowned ${confronted.name} because ${
          confronted.name
        } loves ${mortalEnemiesOfConfronterLoverOfConfrontedIds
          .map((loverId) => characters[loverId]?.name)
          .join(", ")} whom ${confronter.name} wants to kill.`
      );
      return;
    }
  },
};
