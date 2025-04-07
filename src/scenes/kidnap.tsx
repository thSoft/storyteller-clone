import { Scene } from "../types";
import { handleDead } from "./sceneUtils";

const kidnapperSlot = { id: "kidnapper", label: "Kidnapper" };
const kidnappedSlot = { id: "kidnapped", label: "Kidnapped" };
export const kidnap: Scene = {
  id: "kidnap",
  name: "🔐 Kidnap",
  slots: [kidnapperSlot, kidnappedSlot],
  outcomeLogic: (state, assigned) => {
    const kidnapper = assigned[kidnapperSlot.id];
    const kidnapped = assigned[kidnappedSlot.id];
    if (handleDead(state, kidnapper, kidnapped)) return;
    if (!kidnapper || !kidnapped) return;
    if (state.kidnapped[kidnapped.id]) {
      if (state.angryAt[kidnapper.id] === kidnapped.id) {
        state.event = `${kidnapper.name} was angry at ${kidnapped.name}, so didn't free him/her.`;
      } else {
        delete state.kidnapped[kidnapped.id];
        state.event = `${kidnapper.name} freed ${kidnapped.name}.`;
      }
    } else {
      if (state.angryAt[kidnapper.id] !== kidnapped.id) {
        state.event = `${kidnapper.name} was not angry at ${kidnapped.name}.`;
      } else {
        state.kidnapped[kidnapped.id] = true;
        state.angryAt[kidnapped.id] = kidnapper.id;
        state.event = `${kidnapper.name} kidnapped ${kidnapped.name}. ${kidnapped.name} got angry at ${kidnapper.name}.`;
      }
    }
  },
};
