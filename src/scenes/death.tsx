import { characters } from "../characters";
import { Scene } from "../types";
import { getEavesdropperId, handleDeathWitnessing, handlePreconditions, setState } from "./sceneUtils";

export const victimSlot = { id: "victim", label: "Victim" };
export const witnessSlot = { id: "witness", label: "Witness", optional: true };
export const death: Scene = {
  id: "death",
  name: "🪦 Death",
  slots: [victimSlot, witnessSlot],
  outcomeLogic: (state, assigned) => {
    const victim = assigned[victimSlot.id];
    const witness = assigned[witnessSlot.id];
    if (
      handlePreconditions(state, victim, witness, {
        checkDeathWitnessing: false,
      })
    )
      return;

    setState(state, victim.id, "dead", true);
    state.event = `${victim.name} died.`;

    handleDeathWitnessing(state, victim, witness);

    const eavesdropperId = getEavesdropperId(state);
    if (eavesdropperId) {
      handleDeathWitnessing(state, victim, characters[eavesdropperId]);
    }
  },
};
