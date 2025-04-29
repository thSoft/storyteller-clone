import { Scene } from "../types";
import { handlePreconditions, setState } from "./sceneUtils";
export const protectedSlot = { id: "protected", label: "Protected" };
export const shield: Scene = {
  id: "shield",
  name: "🛡️ Shield",
  slots: [protectedSlot],
  outcomeLogic: (state, assigned) => {
    const protectedCharacter = assigned[protectedSlot.id];
    if (handlePreconditions(state, protectedCharacter)) return;
    setState(state, protectedCharacter.id, "protectedFromMurder", true);
    state.event = `${protectedCharacter.name} put on a bulletproof vest.`;
  },
};
