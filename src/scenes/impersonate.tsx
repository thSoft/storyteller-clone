import { characters } from "../characters";
import { Scene } from "../types";
import { handlePreconditions } from "./sceneUtils";
export const impersonatorSlot = { id: "impersonator", label: "Impersonator" };
export const impersonatedSlot = { id: "impersonated", label: "Impersonated", optional: true };
export const impersonate: Scene = {
  id: "impersonate",
  name: "🥸 Impersonate",
  slots: [impersonatorSlot, impersonatedSlot],
  outcomeLogic: (state, assigned) => {
    const impersonator = assigned[impersonatorSlot.id];
    const impersonated = assigned[impersonatedSlot.id];
    if (handlePreconditions(state, impersonator)) return;
    const oldImpersonatedIds = state.getRelated(impersonator.id, "impersonates", impersonator.id);
    if (oldImpersonatedIds.length > 0 && impersonated === undefined) {
      const oldImpersonatedId = oldImpersonatedIds[0];
      state.removeRelation(impersonator.id, "impersonates", oldImpersonatedId);
      state.setGlobalState(
        "event",
        `${impersonator.name} no longer impersonates ${characters[oldImpersonatedId]?.name}.`
      );
      return;
    }
    if (impersonated !== undefined) {
      state.addRelation(impersonator.id, "impersonates", impersonated.id);
      state.setGlobalState("event", `${impersonator.name} impersonated ${impersonated.name}.`);
    }
  },
};
