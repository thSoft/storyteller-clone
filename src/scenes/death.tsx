import { Scene } from "../types";
import { handleDeathWitnessing, handlePreconditions } from "./sceneUtils";

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
    if (
      handlePreconditions(state, victim, witness, {
        checkDeathWitnessing: false,
      })
    )
      return;
    state.graph.setNodeAttribute(victim.id, "dead", true);
    state.event = `${victim.name} died.`;
    handleDeathWitnessing(state, victim, witness);
  },
};
