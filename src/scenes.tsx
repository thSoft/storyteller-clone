import { EntityMap, Scene } from "./types";
import { areRelated, entityMap } from "./utils";

const lover1Slot = { id: "lover1", label: "Lover 1" };
const lover2Slot = { id: "lover2", label: "Lover 2" };
export const love: Scene = {
  id: "love",
  name: "❤️ Love",
  slots: [lover1Slot, lover2Slot],
  outcomeLogic: (state, assigned) => {
    const lover1 = assigned[lover1Slot.id];
    const lover2 = assigned[lover2Slot.id];
    if (lover1 && lover2) {
      state.loves[lover1.id] = lover2.id;
      state.event = `${lover1.name} and ${lover2.name} fell in love.`;
    }
  },
};

const victimSlot = { id: "victim", label: "Victim" };
const witnessSlot = { id: "witness", label: "Witness" };
export const death: Scene = {
  id: "death",
  name: "🪦 Death",
  slots: [victimSlot, witnessSlot],
  outcomeLogic: (state, assigned) => {
    const victim = assigned[victimSlot.id];
    const witness = assigned[witnessSlot.id];
    if (victim) {
      if (state.dead[victim.id] === true) {
        state.event = `${victim.name} remained dead.`;
      } else {
        state.dead[victim.id] = true;
        if (witness && areRelated(state.loves, victim.id, witness.id)) {
          state.heartbroken[witness.id] = true;
          state.event = `${witness.name} was heartbroken by the death of ${victim.name}.`;
        } else {
          state.event = `${victim.name} died.`;
        }
      }
    }
  },
};

export const scenes: EntityMap<Scene> = entityMap([love, death]);
