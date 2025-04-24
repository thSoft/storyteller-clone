import { characters } from "../characters";
import { Character, Scene } from "../types";
import { areRelated, getCharacter, getRelated, getState, handlePreconditions } from "./sceneUtils";

export const lover1Slot = { id: "lover1", label: "Lover 1" };
export const lover2Slot = { id: "lover2", label: "Lover 2" };
export const love: Scene = {
  id: "love",
  name: "❤️ Love",
  slots: [lover1Slot, lover2Slot],
  outcomeLogic: (state, assigned) => {
    const lover1 = assigned[lover1Slot.id];
    const lover2 = assigned[lover2Slot.id];
    if (handlePreconditions(state, lover1, lover2)) return;
    if (!lover1 || !lover2) return;
    const inLoveWithSomeoneElse = (character: Character, otherCharacter: Character | undefined): boolean => {
      return otherCharacter !== undefined && areRelated(state, character.id, "loves", otherCharacter.id);
    };
    const [engaged, rejected] = getCharacter(inLoveWithSomeoneElse, lover1, lover2);
    const [engaged2, _] = getCharacter(inLoveWithSomeoneElse, lover2, lover1);
    if (engaged !== undefined && engaged2 !== undefined && engaged.id !== engaged2.id) {
      state.event = `Both ${engaged.name} and ${engaged2.name} were already in love with someone else.`;
      return;
    }
    if (engaged !== undefined && rejected !== undefined) {
      const theThirdOneId = getRelated(state, engaged.id, "loves")[0];
      if (theThirdOneId === undefined) return;
      const theThirdOne = characters[theThirdOneId];
      if (theThirdOne === undefined) return;
      state.event = `${engaged.name} rejected ${rejected.name} because of ${theThirdOne.name}.`;
      if (getState(state, rejected.id, "spiteful")) {
        state.graph.addEdge(rejected.id, theThirdOne.id, {
          type: "angryAt",
        });
        state.event += ` ${rejected.name} got angry at ${theThirdOne.name}.`;
      } else {
        state.graph.setNodeAttribute(rejected.id, "heartbroken", true);
        state.event += ` ${rejected.name} was heartbroken.`;
      }
      return;
    }
    state.graph.addEdge(lover1.id, lover2.id, { type: "loves" });
    state.event = `${lover1.name} and ${lover2.name} fell in love.`;
  },
};
