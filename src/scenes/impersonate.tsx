import { characters } from "../characters";
import { Scene } from "../types";

export const impersonatorSlot = { id: "impersonator", label: "Impersonator" };
export const impersonatedSlot = { id: "impersonated", label: "Impersonated", optional: true, nonParticipant: true };

export const impersonate: Scene = {
  id: "impersonate",
  name: "Impersonate",
  color: "#86C2B9",
  slots: [impersonatorSlot, impersonatedSlot],
  outcomeLogic: (state, assigned) => {
    const impersonator = assigned[impersonatorSlot.id];
    const impersonated = assigned[impersonatedSlot.id];
    const oldImpersonatedIds = state.getRelated(impersonator.id, "impersonates");
    if (oldImpersonatedIds.length > 0 && impersonated === undefined) {
      const oldImpersonatedId = oldImpersonatedIds[0];
      state.removeRelation(impersonator.id, "impersonates", oldImpersonatedId);
      state.setDescription(`${impersonator.name} no longer impersonates ${characters[oldImpersonatedId]?.name}.`);
      return;
    }
    if (impersonated !== undefined) {
      state.addRelation(impersonator.id, "impersonates", impersonated.id);
      state.setDescription(`${impersonator.name} impersonated ${impersonated.name}.`);
    }
  },
};
