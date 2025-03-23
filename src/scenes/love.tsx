import { Scene } from "../types";

const lover1Slot = { id: "lover1", label: "Lover 1" };
const lover2Slot = { id: "lover2", label: "Lover 2" };
export const love: Scene = {
  id: "love",
  name: "❤️ Love",
  slots: [lover1Slot, lover2Slot],
  outcomeLogic: (state, assigned) => {
    const lover1 = assigned[lover1Slot.id];
    const lover2 = assigned[lover2Slot.id];
    if (lover1 && lover2) {
      state.loves[lover1.id] = lover2.id;
      state.event = `${lover1.name} and ${lover2.name} fell in love.`;
    }
  },
};
