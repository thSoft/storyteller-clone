import { dragon, knight, princess } from "../characters";
import { Scene } from "../types";
import { handlePreconditions } from "./sceneUtils";

const attackerSlot = { id: "attacker", label: "Attacker" };
const defenderSlot = { id: "defender", label: "Defender" };
export const attack: Scene = {
  id: "attack",
  name: "✊ Attack",
  slots: [attackerSlot, defenderSlot],
  outcomeLogic: (state, assigned) => {
    const attacker = assigned[attackerSlot.id];
    const defender = assigned[defenderSlot.id];
    if (handlePreconditions(state, attacker, defender)) return;
    if (!attacker || !defender) return;
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
              state.event = `${dragon.name} attacked ${knight.name} with its tail, but ${knight.name} dodged. The tail hit the castle.`;
              state.event += hitCastle();
            }
            break;
          case princess.id:
            if (state.dragonCanBreatheFire) {
              state.dead[princess.id] = true;
              state.event = `${dragon.name} attacked ${princess.name}, burning her to a crisp.`;
            } else {
              state.event = `${dragon.name} attacked ${princess} with its tail, but the tail only hit the castle.`;
              state.event += hitCastle();
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
          if (!state.princessIsFree) {
            state.dead[princess.id] = true;
          }
          return ` The castle collapsed, squashing ${dragon.name}${
            state.princessIsFree ? "" : ` and ${princess.name}`
          }.`;
        case "collapsed":
          return "";
      }
    }
  },
};
