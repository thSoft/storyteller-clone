import { Scene } from "../types";

const confronterSlot = { id: "confronter", label: "Confronter" };
const confrontedSlot = { id: "confronted", label: "Confronted" };

export const confiscate: Scene = {
  id: "confiscate",
  name: "Confiscate",
  slots: [confronterSlot, confrontedSlot],
  outcomeLogic: (state, assigned) => {
    const confronter = assigned[confronterSlot.id];
    const confronted = assigned[confrontedSlot.id];
    // If confronted has gun and believes that confronter works for police,
    // and confronter is aware of confronted promised murder or killed someone,
    // then confiscate it
    const knowsAboutHitPlan = state.getRelated(confronted.id, "promisedMurderTo", confronter.id).length > 0;
    const knowsAboutHit = state.getRelated(confronted.id, "killed", confronter.id).length > 0;
    if (
      state.getState(confronter.id, "worksForPolice", confronted.id) &&
      (knowsAboutHitPlan || knowsAboutHit) &&
      state.getGlobalState("gunOwner")?.id === confronted.id
    ) {
      state.setGlobalState("gunOwner", confronter);
      state.setDescription(
        `${confronter.name} confiscated the violin case from ${confronted.name} because (s)he knew that ${
          confronted.name
        } got it when (s)he ${knowsAboutHitPlan ? "promised to kill" : "killed"} someone.`
      );
      return;
    }
  },
};
