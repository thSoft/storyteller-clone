import { Scene } from "../types";
import { handlePreconditions } from "./sceneUtils";

const protectedSlot = { id: "protected", label: "Protected" };

export const wearArmor: Scene = {
  id: "wearArmor",
  name: "Wear Armor",
  slots: [protectedSlot],
  outcomeLogic: (state, assigned) => {
    const protectedCharacter = assigned[protectedSlot.id];
    if (handlePreconditions(state, protectedCharacter)) return;
    state.setState(protectedCharacter.id, "protectedFromMurder", true);
    state.setDescription(`${protectedCharacter.name} put on a bulletproof vest.`);
    // TODO state.act(protectedCharacter.id, "wearArmor");
  },
};
