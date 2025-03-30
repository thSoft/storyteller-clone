import { duchess } from "../characters";
import { Scene } from "../types";
import { handleDead } from "./sceneUtils";

const personSlot = { id: "person", label: "Person" };
export const safe: Scene = {
  id: "safe",
  name: "🔒 Safe",
  slots: [personSlot],
  outcomeLogic: (state, assigned) => {
    const person = assigned[personSlot.id];
    if (handleDead(state, person)) return;
    if (!person) return;
    if (person.id === duchess.id) {
      state.guardFollowsDuchess = true;
      state.event = `${person.name} flirted with the guard. He now wants to dance with her.`;
      return;
    }
    if (state.hasMoney[person.id]) {
      if (state.knowsCodeOfSafe[person.id]) {
        state.safeHasMoney = true;
        state.hasMoney[person.id] = false;
        state.event = `${person.name} placed his money in the safe and greeted the guard.`;
      } else {
        state.event = `${person.name} tried to place his money in the safe, but he didn't know the code.`;
      }
    } else {
      if (state.safeIsGuarded) {
        if (state.personWithGun === person.id) {
          state.event = `${person.name} tried to shoot the guard and take the money from the safe, but the guard had a bulletproof vest.`;
        } else {
          state.event = `${person.name} tried to take the money from the safe, but the guard stopped him/her.`;
        }
      } else {
        if (state.knowsCodeOfSafe[person.id]) {
          state.safeHasMoney = false;
          state.hasMoney[person.id] = true;
          state.event = `${person.name} took the money from the safe.`;
        } else {
          state.event = `${person.name} tried to take the money from the safe, but he didn't know the code.`;
        }
      }
    }
  },
};
