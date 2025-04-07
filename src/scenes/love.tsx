import { characters } from "../characters";
import { Character, Scene } from "../types";
import { getPerson, getRelated, handlePreconditions } from "./sceneUtils";

const lover1Slot = { id: "lover1", label: "Lover 1" };
const lover2Slot = { id: "lover2", label: "Lover 2" };
export const love: Scene = {
  id: "love",
  name: "❤️ Love",
  slots: [lover1Slot, lover2Slot],
  outcomeLogic: (state, assigned) => {
    const lover1 = assigned[lover1Slot.id];
    const lover2 = assigned[lover2Slot.id];
    if (handlePreconditions(state, lover1, lover2)) return;
    if (!lover1 || !lover2) return;
    const inLoveWithSomeoneElse = (
      person: Character,
      otherPerson: Character | undefined
    ): boolean => {
      const lover = getRelated(state.loves, person);
      return lover !== undefined && lover !== otherPerson?.id;
    };
    const [engaged, rejected] = getPerson(
      inLoveWithSomeoneElse,
      lover1,
      lover2
    );
    const [engaged2, _] = getPerson(inLoveWithSomeoneElse, lover2, lover1);
    if (
      engaged !== undefined &&
      engaged2 !== undefined &&
      engaged.id !== engaged2.id
    ) {
      state.event = `Both ${engaged.name} and ${engaged2.name} were already in love with someone else.`;
      return;
    }
    if (engaged !== undefined && rejected !== undefined) {
      const theThirdOneId = getRelated(state.loves, engaged);
      if (theThirdOneId === undefined) return;
      const theThirdOne = characters[theThirdOneId];
      if (theThirdOne === undefined) return;
      state.event = `${engaged.name} rejected ${rejected.name} because of ${theThirdOne.name}.`;
      if (state.spiteful[rejected.id]) {
        state.angryAt[rejected.id] = theThirdOne.id;
        state.event += ` ${rejected.name} got angry at ${theThirdOne.name}.`;
      } else {
        state.heartbroken[rejected.id] = true;
        state.event += ` ${rejected.name} was heartbroken.`;
      }
      return;
    }
    state.loves[lover1.id] = lover2.id;
    state.event = `${lover1.name} and ${lover2.name} fell in love.`;
  },
};
