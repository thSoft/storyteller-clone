import { Scene } from "../types";
import { handlePreconditions } from "./sceneUtils";

const protectedSlot = { id: "protected", label: "Protected" };

export const wearBulletproofVest: Scene = {
  id: "wearBulletproofVest",
  name: "Wear Bulletproof Vest",
  slots: [protectedSlot],
  outcomeLogic: (state, assigned) => {
    const protectedCharacter = assigned[protectedSlot.id];
    if (handlePreconditions(state, protectedCharacter)) return;
    state.setState(protectedCharacter.id, "protectedFromMurder", true);
    state.setDescription(`${protectedCharacter.name} put on a bulletproof vest.`);
  },
};
