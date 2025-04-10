import { grandma, red, wolf } from "../characters";
import { Scene } from "../types";
import {
  handleLittleRedRidingHoodCharactersMeeting,
  handlePreconditions,
  ifCharactersAre,
} from "./sceneUtils";

const person1Slot = { id: "person1", label: "Person 1" };
const person2Slot = { id: "person2", label: "Person 2" };
export const forest: Scene = {
  id: "forest",
  name: "🌳 Forest",
  slots: [person1Slot, person2Slot],
  outcomeLogic: (state, assigned) => {
    const person1 = assigned[person1Slot.id];
    const person2 = assigned[person2Slot.id];
    if (handlePreconditions(state, person1, person2)) return;
    if (person1?.id === grandma.id || person2?.id === grandma.id) {
      state.event = `${grandma.name} is very old, so she can't exit her house.`;
      return;
    }
    if (person1 === undefined || person2 === undefined) {
      return;
    }
    if (
      ifCharactersAre(
        person1,
        person2,
        (a, b) => a.id === red.id && b.id === wolf.id,
        () => {
          if (state.knowsAboutWolf[red.id]) {
            state.dead[red.id] = true;
            state.event = `${wolf.name} asked ${red.name} where is ${grandma.name}'s house, but she refused to answer, so ${wolf.name} ate her.`;
          } else {
            state.knowsAboutWolf[red.id] = true;
            state.knowsLocationOfGrandma[wolf.id] = true;
            state.event = `${wolf.name} asked ${red.name} where is ${grandma.name}'s house, and she told him.`;
          }
        }
      )
    )
      return;
    handleLittleRedRidingHoodCharactersMeeting(
      state,
      person1,
      person2,
      false,
      false
    );
  },
};
