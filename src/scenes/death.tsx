import { characters } from "../characters";
import { Scene } from "../types";
import { handleDeathWitnessing, handlePreconditions } from "./sceneUtils";

export const victimSlot = { id: "victim", label: "Victim" };
export const witnessSlot = { id: "witness", label: "Witness", optional: true };
export const death: Scene = {
  id: "death",
  name: "🪦 Death",
  slots: [victimSlot, witnessSlot],
  outcomeLogic: (state, assigned) => {
    const victim = assigned[victimSlot.id];
    const witness = assigned[witnessSlot.id];
    if (handlePreconditions(state, victim, witness, { checkDeathWitnessing: false })) return;

    state.setState(victim.id, "dead", true);
    state.setDescription(`${victim.name} died.`);

    handleDeathWitnessing(state, victim, witness);

    const eavesdropperId = state.getGlobalState("eavesdropper")?.id;
    if (eavesdropperId) {
      handleDeathWitnessing(state, victim, characters[eavesdropperId]);
    }
  },
};
