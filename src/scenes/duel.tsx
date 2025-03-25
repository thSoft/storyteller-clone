import { firebird, jackFrost, neptune } from "../characters";
import { Scene } from "../types";
import { handleDead } from "./sceneUtils";

const fighter1Slot = { id: "fighter1", label: "Fighter 1" };
const fighter2Slot = { id: "fighter2", label: "Fighter 2" };
export const duel: Scene = {
  id: "duel",
  name: "⚔️ Duel",
  slots: [fighter1Slot, fighter2Slot],
  outcomeLogic: (state, assigned) => {
    const fighter1 = assigned[fighter1Slot.id];
    const fighter2 = assigned[fighter2Slot.id];
    const defeats = Object.fromEntries([
      [firebird.id, jackFrost.id],
      [jackFrost.id, neptune.id],
      [neptune.id, firebird.id],
    ]);
    if (handleDead(state, fighter1, fighter2)) return;
    if (!fighter1 || !fighter2) return;
    if (defeats[fighter1.id] === fighter2.id) {
      state.dead[fighter2.id] = true;
      state.event = `${fighter1.name} defeated ${fighter2.name}.`;
    } else if (defeats[fighter2.id] === fighter1.id) {
      state.dead[fighter1.id] = true;
      state.event = `${fighter2.name} defeated ${fighter1.name}.`;
    } else {
      state.event = "The duel ended in a draw.";
    }
  },
};
