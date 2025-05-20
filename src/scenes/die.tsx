import { characters } from "../characters";
import { Scene } from "../types";
import { handleDeathWitnessing } from "./sceneUtils";

const victimSlot = { id: "victim", label: "Victim" };

export const die: Scene = {
  id: "die",
  name: "Die",
  color: "#000000",
  slots: [victimSlot],
  outcomeLogic: (state, assigned) => {
    const victim = assigned[victimSlot.id];
    state.setState(victim.id, "dead", true);
    state.setDescription(`${victim.name} died.`);
    state.act(victim.id, "die");
    const eavesdropperId = state.getGlobalState("eavesdropper")?.id;
    if (eavesdropperId) {
      handleDeathWitnessing(state, victim, characters[eavesdropperId]);
    }
  },
};
