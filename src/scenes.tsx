import { firebird, jackFrost, neptune } from "./characters";
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
    if (fighter1 && state.defeated[fighter1.id]) {
      state.event = `${fighter1.name} was already defeated.`;
    } else if (fighter2 && state.defeated[fighter2.id]) {
      state.event = `${fighter2.name} was already defeated.`;
    } else if (fighter1 && fighter2) {
      if (defeats[fighter1.id] === fighter2.id) {
        state.defeated[fighter2.id] = true;
        state.event = `${fighter1.name} defeated ${fighter2.name}.`;
      } else if (defeats[fighter2.id] === fighter1.id) {
        state.defeated[fighter1.id] = true;
        state.event = `${fighter2.name} defeated ${fighter1.name}.`;
      } else {
        state.event = "The duel ended in a draw.";
      }
    }
  },
};

export const scenes: EntityMap<Scene> = entityMap([love, death, duel]);
