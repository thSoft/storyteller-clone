import { Scene } from "../types";

const donorSlot = { id: "donor", label: "Donor" };
const beggarSlot = { id: "beggar", label: "Beggar" };
export const begging: Scene = {
  id: "begging",
  name: "🤲 Begging",
  slots: [donorSlot, beggarSlot],
  outcomeLogic: (state, assigned) => {
    const donor = assigned[donorSlot.id];
    const beggar = assigned[beggarSlot.id];
    if (!donor || !beggar) {
      return;
    }
    if (state.hasMoney[donor.id]) {
      if (state.willingToGiveMoney[donor.id]) {
        state.hasMoney[beggar.id] = true;
        state.hasMoney[donor.id] = false;
        state.event = `${donor.name} gave money to ${beggar.name}.`;
      } else {
        state.event = `${donor.name} refused to give money to ${beggar.name}.`;
      }
    } else {
      state.event = `${donor.name} has no money to give to ${beggar.name}.`;
    }
  },
};
