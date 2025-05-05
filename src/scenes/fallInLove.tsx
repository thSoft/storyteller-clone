import { characters } from "../characters";
import { Character, Scene } from "../types";
import { getCharacter, handlePreconditions } from "./sceneUtils";

export const lover1Slot = { id: "lover1", label: "Lover 1" };
export const lover2Slot = { id: "lover2", label: "Lover 2" };

export const fallInLove: Scene = {
  id: "fallInLove",
  name: "Fall in Love",
  slots: [lover1Slot, lover2Slot],
  outcomeLogic: (state, assigned) => {
    const lover1 = assigned[lover1Slot.id];
    const lover2 = assigned[lover2Slot.id];
    if (handlePreconditions(state, lover1, lover2)) return;
    if (state.getState(lover1.id, "sex") === state.getState(lover2.id, "sex")) {
      state.setDescription(`${lover1.name} and ${lover2.name} are of the same sex.`);
      return;
    }
    const inLoveWithSomeoneElse = (character: Character, otherCharacter: Character | undefined): boolean => {
      return otherCharacter !== undefined && state.areRelated(character.id, "loves", otherCharacter.id);
    };
    const [engaged, rejected] = getCharacter(inLoveWithSomeoneElse, lover1, lover2);
    const [engaged2, _] = getCharacter(inLoveWithSomeoneElse, lover2, lover1);
    if (engaged !== undefined && engaged2 !== undefined && engaged.id !== engaged2.id) {
      state.setDescription(`Both ${engaged.name} and ${engaged2.name} were already in love with someone else.`);
      return;
    }
    if (engaged !== undefined && rejected !== undefined) {
      const theThirdOneId = state.getRelated(engaged.id, "loves")[0];
      if (theThirdOneId === undefined) return;
      const theThirdOne = characters[theThirdOneId];
      if (theThirdOne === undefined) return;
      state.setDescription(`${engaged.name} rejected ${rejected.name} because of ${theThirdOne.name}.`);
      if (state.getState(rejected.id, "spiteful")) {
        state.addRelation(rejected.id, "angryAt", theThirdOne.id);
        state.setDescription(`${rejected.name} got angry at ${theThirdOne.name}.`);
      } else {
        state.setState(rejected.id, "heartbroken", true);
        state.setDescription(`${rejected.name} was heartbroken.`);
      }
      return;
    }
    state.addRelation(lover1.id, "loves", lover2.id);
    state.addRelation(lover2.id, "loves", lover1.id);
    state.setDescription(`${lover1.name} and ${lover2.name} fell in love.`);
  },
};
