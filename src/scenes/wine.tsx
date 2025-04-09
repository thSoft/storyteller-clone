import { Scene } from "../types";
import { handlePreconditions } from "./sceneUtils";

export const wineDrinkerSlot = { id: "person", label: "Person" };
export const wine: Scene = {
  id: "wine",
  name: "🍷 Wine",
  slots: [wineDrinkerSlot],
  outcomeLogic: (state, assigned) => {
    const person = assigned[wineDrinkerSlot.id];
    if (handlePreconditions(state, person)) return;
    if (!person) return;
    if (state.wineIsPoisonedBy) {
      state.dead[person.id] = true;
      state.event = `${person.name} drank the poisoned wine and died.`;
    } else {
      if (state.heartbroken[person.id]) {
        state.drunk[person.id] = true;
        state.event = `${person.name} drank too much wine out of heartbreak and got drunk.`;
      } else {
        state.event = `${person.name} drank some fine wine.`;
      }
    }
  },
};
