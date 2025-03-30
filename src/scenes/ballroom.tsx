import { duchess } from "../characters";
import { Scene } from "../types";
import { getPerson, handleDead } from "./sceneUtils";

const person1Slot = { id: "person1", label: "Person 1" };
const person2Slot = { id: "person2", label: "Person 2" };
export const ballroom: Scene = {
  id: "ballroom",
  name: "🪟 Ballroom",
  slots: [person1Slot, person2Slot],
  outcomeLogic: (state, assigned) => {
    const person1 = assigned[person1Slot.id];
    const person2 = assigned[person2Slot.id];
    if (handleDead(state, person1, person2)) return;
    const [personWithGun, otherPerson] = getPerson(
      (person) => state.personWithGun === person.id,
      person1,
      person2
    );
    if (personWithGun && otherPerson && state.knowsCodeOfSafe[otherPerson.id]) {
      state.knowsCodeOfSafe[personWithGun.id] = true;
      state.event = `${personWithGun.name} threatened ${otherPerson.name} with the gun, so ${otherPerson.name} told him/her the code of the safe.`;
      return;
    }
    if (
      state.guardFollowsDuchess &&
      (person1?.id === duchess.id || person2?.id === duchess.id)
    ) {
      state.safeIsGuarded = false;
      state.event = `The guard dances with ${duchess.name} in the ballroom and is no longer guarding the safe.`;
      return;
    }
    if (person1 && person2) {
      state.event = `${person1.name} and ${person2.name} met in the ballroom.`;
    }
  },
};
