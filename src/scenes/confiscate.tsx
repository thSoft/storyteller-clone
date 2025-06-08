import { Scene } from "../types";
import { canShowPoliceBadge } from "./sceneUtils";

const confronterSlot = { id: "confronter", label: "Confronter" };
const confrontedSlot = { id: "confronted", label: "Confronted" };

export const confiscate: Scene = {
  id: "confiscate",
  name: "Confiscate",
  color: "#9BA6B3",
  slots: [confronterSlot, confrontedSlot],
  outcomeLogic: (state, assigned) => {
    const confronter = assigned[confronterSlot.id];
    const confronted = assigned[confrontedSlot.id];
    if (!canShowPoliceBadge(state, confronter, confronted)) {
      state.think(confronter.id, `${confronted.name} won't believe I'm a police officer.`);
      return;
    }
    // If confronted has gun and believes that confronter works for police,
    // and confronter is aware of confronted promised murder or killed someone,
    // then confiscate it
    const knowsAboutHitPlan = state.getRelated(confronted.id, "promisedMurderTo", confronter.id).length > 0;
    const knowsAboutHit = state.getRelated(confronted.id, "killed", confronter.id).length > 0;
    if ((knowsAboutHitPlan || knowsAboutHit) && state.getGlobalState("gunOwner")?.id === confronted.id) {
      state.setGlobalState("gunOwner", confronter);
      state.say(confronter.id, `Let me check that violin case!`);
      // TODO state.act(confronter.id, "confiscate");
      // TODO state.act(confronted.id, "confiscated");
      return;
    } else {
      state.say(confronter.id, `Please proceed.`);
      // TODO state.act(confronter.id, "bodyCheck");
      // TODO state.act(confronted.id, "bodyChecked");
      return;
    }
  },
};
