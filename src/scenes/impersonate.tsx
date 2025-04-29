import { characters } from "../characters";
import { Scene } from "../types";
import { addRelation, getRelated, handlePreconditions, removeRelation } from "./sceneUtils";
export const impersonatorSlot = { id: "impersonator", label: "Impersonator" };
export const impersonatedSlot = { id: "impersonated", label: "Impersonated" };
export const impersonate: Scene = {
  id: "impersonate",
  name: "🥸 Impersonate",
  slots: [impersonatorSlot, impersonatedSlot],
  outcomeLogic: (state, assigned) => {
    const impersonator = assigned[impersonatorSlot.id];
    const impersonated = assigned[impersonatedSlot.id];
    if (!impersonator) return;
    if (handlePreconditions(state, impersonator)) return;
    const impersonatedCharacterIds = getRelated(state, impersonator.id, "impersonates");
    if (impersonatedCharacterIds.length > 0 && impersonated === undefined) {
      removeRelation(state, impersonator.id, "impersonates", impersonatedCharacterIds[0]);
      state.event = `${impersonator.actually.name} no longer impersonates ${
        characters[impersonatedCharacterIds[0]]?.name
      }.`;
      return;
    }
    if (impersonated !== undefined) {
      addRelation(state, impersonator.id, "impersonates", impersonated.id);
      state.event = `${impersonator.name} impersonated ${impersonated.name}.`;
    }
  },
};
