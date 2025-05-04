import { characters } from "../characters";
import { Scene } from "../types";
import { handlePreconditions } from "./sceneUtils";

export const confronterSlot = { id: "confronter", label: "Confronter" };
export const confrontedSlot = { id: "confronted", label: "Confronted" };
export const confrontation: Scene = {
  id: "confrontation",
  name: "🫵 Confrontation",
  slots: [confronterSlot, confrontedSlot],
  outcomeLogic: (state, assigned) => {
    const confronter = assigned[confronterSlot.id];
    const confronted = assigned[confrontedSlot.id];
    if (handlePreconditions(state, confronter, confronted)) return;
    // If confronter works for police and is aware of the confronted having killed someone,
    // then arrest the confronted
    if (
      state.getState(confronter.id, "worksForPolice") &&
      state.getRelated(confronted.id, "killed", confronter.id).length > 0
    ) {
      state.setState(confronted.id, "arrested", true);
      state.setDescription(`${confronter.name} arrested ${confronted.name} for murder.`);
      return;
    }
    // If confronter works for police and is aware of the confronted having robbed the bank,
    // then arrest the confronted
    if (
      state.getState(confronter.id, "worksForPolice") &&
      state.getGlobalState("bankRobber", confronter.id)?.id === confronted.id
    ) {
      state.setState(confronted.id, "arrested", true);
      state.setDescription(`${confronter.name} arrested ${confronted.name} for robbery.`);
      return;
    }
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
      state.setGlobalState(
        "event",
        `${confronter.name} confiscated the violin case from ${confronted.name} because (s)he knew that ${
          confronted.name
        } got it when (s)he ${knowsAboutHitPlan ? "promised to kill" : "killed"} someone.`
      );
      return;
    }
    // If confronter is aware of the confronted loving someone who the confronter wants to kill,
    // and the confronted is child of the confronter, then disown the confronted
    const loverOfConfrontedIds = [
      ...state.getRelated(confronted.id, "loves", confronter.id),
      ...state.getRelatedBy(confronted.id, "loves", confronter.id),
    ];
    const mortalEnemiesOfConfronterLoverOfConfrontedIds = loverOfConfrontedIds.filter((loverId) =>
      state.areRelated(confronter.id, "wantsToKill", loverId)
    );
    if (
      mortalEnemiesOfConfronterLoverOfConfrontedIds.length > 0 &&
      state.areRelated(confronted.id, "childOf", confronter.id)
    ) {
      state.setState(confronted.id, "disowned", true);
      state.setGlobalState(
        "event",
        `${confronter.name} disowned ${confronted.name} because ${
          confronted.name
        } loves ${mortalEnemiesOfConfronterLoverOfConfrontedIds
          .map((loverId) => characters[loverId]?.name)
          .join(", ")} whom ${confronter.name} wants to kill.`
      );
      return;
    }
    state.setDescription(`${confronter.name} had nothing to confront ${confronted.name} about.`);
  },
};
