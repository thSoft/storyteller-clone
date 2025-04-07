import { butler } from "../characters";
import { Scene } from "../types";
import { handlePreconditions } from "./sceneUtils";

const personSlot = { id: "person", label: "Person" };
export const gun: Scene = {
  id: "gun",
  name: "🔫 Gun",
  slots: [personSlot],
  outcomeLogic: (state, assigned) => {
    const person = assigned[personSlot.id];
    if (handlePreconditions(state, person)) return;
    if (!person) return;
    if (person.id === state.personWithGun) {
      state.personWithGun = undefined;
      state.event = `${person.name} put down the gun.`;
    } else {
      if (person.id === butler.id) {
        state.personWithGun = person.id;
        state.event = `${person.name} picked up the gun.`;
      } else {
        state.event = `${person.name} was shocked that the gun was missing.`;
      }
    }
  },
};
