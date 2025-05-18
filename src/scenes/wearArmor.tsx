import { Scene } from "../types";

const protectedSlot = { id: "protected", label: "Protected" };

export const wearArmor: Scene = {
  id: "wearArmor",
  name: "Wear Armor",
  color: "#7AC15D",
  slots: [protectedSlot],
  outcomeLogic: (state, assigned) => {
    const protectedCharacter = assigned[protectedSlot.id];
    state.setState(protectedCharacter.id, "protectedFromMurder", true);
    state.setDescription(`${protectedCharacter.name} put on a bulletproof vest.`);
    state.act(protectedCharacter.id, "wearArmor");
  },
};
