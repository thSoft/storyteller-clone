import { Scene } from "../types";
import { handleDead } from "./sceneUtils";

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
    if (handleDead(state, victim)) return;
    handleDead(state, witness);
    state.dead[victim.id] = true;
    state.event = `${victim.name} died.`;
    handleDead(state, victim, witness);
  },
};
