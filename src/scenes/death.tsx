import { Scene } from "../types";
import { handleHeartbreakDueToDeath, handlePreconditions } from "./sceneUtils";

const victimSlot = { id: "victim", label: "Victim" };
const witnessSlot = { id: "witness", label: "Witness" };
export const death: Scene = {
  id: "death",
  name: "🪦 Death",
  slots: [victimSlot, witnessSlot],
  outcomeLogic: (state, assigned) => {
    const victim = assigned[victimSlot.id];
    const witness = assigned[witnessSlot.id];
    if (!victim) return;
    if (handlePreconditions(state, victim, witness, { checkHeartbreak: false }))
      return;
    state.dead[victim.id] = true;
    state.event = `${victim.name} died.`;
    handleHeartbreakDueToDeath(state, victim, witness);
  },
};
