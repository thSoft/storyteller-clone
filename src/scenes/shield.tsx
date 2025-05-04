import { Scene } from "../types";
import { handlePreconditions } from "./sceneUtils";
export const protectedSlot = { id: "protected", label: "Protected" };
export const shield: Scene = {
  id: "shield",
  name: "🛡️ Shield",
  slots: [protectedSlot],
  outcomeLogic: (state, assigned) => {
    const protectedCharacter = assigned[protectedSlot.id];
    if (handlePreconditions(state, protectedCharacter)) return;
    state.setState(protectedCharacter.id, "protectedFromMurder", true);
    state.setDescription(`${protectedCharacter.name} put on a bulletproof vest.`);
  },
};
