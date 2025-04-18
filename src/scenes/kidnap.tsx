import { characters } from "../characters";
import { Scene } from "../types";
import { handlePreconditions } from "./sceneUtils";

export const kidnapperSlot = { id: "kidnapper", label: "Kidnapper/Rescuer" };
export const kidnappedSlot = { id: "kidnapped", label: "Kidnapped" };
export const kidnap: Scene = {
  id: "kidnap",
  name: "🔐 Kidnap",
  slots: [kidnapperSlot, kidnappedSlot],
  outcomeLogic: (state, assigned) => {
    const kidnapper = assigned[kidnapperSlot.id];
    const kidnapped = assigned[kidnappedSlot.id];
    if (
      handlePreconditions(state, kidnapper, kidnapped, {
        checkDeathWitnessing: false,
      })
    )
      return;
    if (state.kidnapped === kidnapper.id) {
      state.event = `${kidnapper.name} was kidnapped.`;
      return;
    }
    if (!kidnapper || !kidnapped) return;
    if (state.kidnapped === kidnapped.id) {
      if (state.angryAt[kidnapper.id] === kidnapped.id) {
        state.event = `${kidnapper.name} was angry at ${kidnapped.name}, so didn't free him/her.`;
      } else {
        state.kidnapped = undefined;
        state.event = `${kidnapper.name} freed ${kidnapped.name}.`;
      }
    } else if (state.kidnapped === undefined) {
      if (state.angryAt[kidnapper.id] !== kidnapped.id) {
        state.event = `${kidnapper.name} was not angry at ${kidnapped.name}.`;
      } else {
        state.kidnapped = kidnapped.id;
        state.angryAt[kidnapped.id] = kidnapper.id;
        state.event = `${kidnapper.name} kidnapped ${kidnapped.name}. ${kidnapped.name} got angry at ${kidnapper.name}.`;
      }
    } else if (state.kidnapped !== kidnapped.id) {
      const alreadyKidnapped = characters[state.kidnapped];
      if (alreadyKidnapped !== undefined) {
        state.event = `${alreadyKidnapped.name} was already kidnapped.`;
      }
    }
  },
};
