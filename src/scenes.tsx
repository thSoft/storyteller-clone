import {
  dragon,
  firebird,
  jackFrost,
  knight,
  neptune,
  princess,
} from "./characters";
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

const attackerSlot = { id: "attacker", label: "Attacker" };
const defenderSlot = { id: "defender", label: "Defender" };
export const attack: Scene = {
  id: "attack",
  name: "✊ Attack",
  slots: [attackerSlot, defenderSlot],
  outcomeLogic: (state, assigned) => {
    const attacker = assigned[attackerSlot.id];
    const defender = assigned[defenderSlot.id];
    if (!attacker || !defender) {
      return;
    }
    switch (attacker.id) {
      case knight.id:
        switch (defender.id) {
          case dragon.id:
            state.distracted[dragon.id] = true;
            state.event = `${knight.name} attacked ${dragon.name}, distracting it.`;
            break;
          case princess.id:
            state.event = `${knight.name} could never attack ${princess.name}.`;
            break;
        }
        break;
      case dragon.id:
        switch (defender.id) {
          case knight.id:
            if (state.dragonCanBreatheFire) {
              state.dead[knight.id] = true;
              state.event = `${dragon.name} attacked ${knight.name}, burning him to a crisp.`;
            } else {
              const eventPostfix = hitCastle();
              state.event = `${dragon.name} attacked ${knight.name} with its tail, but ${knight.name} dodged. The tail hit the castle.${eventPostfix}`;
            }
            break;
          case princess.id:
            if (state.dragonCanBreatheFire) {
              state.dead[princess.id] = true;
              state.event = `${dragon.name} attacked ${princess.name}, burning her to a crisp.`;
            } else {
              const eventPostfix = hitCastle();
              state.event = `${dragon.name} attacked ${princess} with its tail, but the tail only hit the castle.${eventPostfix}`;
            }
            break;
        }
        break;
      case princess.id:
        switch (defender.id) {
          case dragon.id:
            state.dragonCanBreatheFire = false;
            state.event = `${princess.name} poured a bucket of water on ${dragon.name}, preventing it from breathing fire.`;
            break;
          case knight.id:
            state.event = `${princess.name} poured a bucket of water on ${knight.name}, dousing him.`;
            break;
        }
        break;
    }
    function hitCastle(): string {
      switch (state.castleHealth) {
        case "intact":
          state.castleHealth = "cracked";
          return " The castle cracked.";
        case "cracked":
          state.castleHealth = "collapsed";
          state.dead[dragon.id] = true;
          return ` The castle collapsed, squashing ${dragon.name}${
            state.princessIsFree ? "" : ` and ${princess.name}`
          }.`;
        case "collapsed":
          return "";
      }
    }
  },
};

export const escape: Scene = {
  id: "escape",
  name: "🚪 Escape",
  slots: [],
  outcomeLogic: (state) => {
    switch (state.castleHealth) {
      case "intact":
        state.event = "The castle was intact. No one could escape.";
        break;
      case "cracked":
        if (state.distracted[dragon.id]) {
          state.princessIsFree = true;
          state.event = `The castle was cracked, and ${dragon.name} was distracted, so ${princess.name} escaped.`;
          break;
        } else {
          state.event = `${princess.name} tried to escape, but ${dragon.name} didn't let her out.`;
          break;
        }
      case "collapsed":
        state.event = "The castle had collapsed. No one could escape.";
        break;
    }
  },
};

export const scenes: EntityMap<Scene> = entityMap([
  love,
  death,
  duel,
  attack,
  escape,
]);
