import { Scene } from "../types";
import { areRelated } from "../utils";

const victimSlot = { id: "victim", label: "Victim" };
const witnessSlot = { id: "witness", label: "Witness" };
export const death: Scene = {
  id: "death",
  name: "🪦 Death",
  slots: [victimSlot, witnessSlot],
  outcomeLogic: (state, assigned) => {
    const victim = assigned[victimSlot.id];
    const witness = assigned[witnessSlot.id];
    if (victim) {
      if (state.dead[victim.id] === true) {
        state.event = `${victim.name} remained dead.`;
      } else {
        state.dead[victim.id] = true;
        if (witness && areRelated(state.loves, victim.id, witness.id)) {
          state.heartbroken[witness.id] = true;
          state.event = `${witness.name} was heartbroken by the death of ${victim.name}.`;
        } else {
          state.event = `${victim.name} died.`;
        }
      }
    }
  },
};
