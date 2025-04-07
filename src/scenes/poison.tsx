import { characters } from "../characters";
import { Scene } from "../types";
import { handleDead } from "./sceneUtils";

const personSlot = { id: "person", label: "Person" };
export const poison: Scene = {
  id: "poison",
  name: "☠️ Poison",
  slots: [personSlot],
  outcomeLogic: (state, assigned) => {
    const person = assigned[personSlot.id];
    if (handleDead(state, person)) return;
    if (!person) return;
    const victimId = state.angryAt[person.id];
    if (
      state.willingToKill[person.id] !== undefined &&
      victimId !== undefined
    ) {
      const victim = characters[victimId];
      if (victim !== undefined) {
        state.wineIsPoisonedBy = person.id;
        state.event = `${person.name} wanted to poison ${victim.name}, so he/she poisoned the wine.`;
      }
      return;
    }
    if (state.heartbroken[person.id]) {
      state.dead[person.id] = true;
      state.event = `${person.name} was heartbroken, so he/she drank poison and died.`;
    }
  },
};
