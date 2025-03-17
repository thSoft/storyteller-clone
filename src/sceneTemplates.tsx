import { EntityMap, SceneTemplate, StoryState } from "./types";
import { addCharacterState, addPair, entityMap, hasPair } from "./utils";

const lover1Slot = { id: "lover1", label: "Lover 1" };
const lover2Slot = { id: "lover2", label: "Lover 2" };
export const love: SceneTemplate = {
  id: "love",
  name: "❤️ Love",
  slots: [lover1Slot, lover2Slot],
  outcomeLogic: (state, assigned) => {
    const lover1 = assigned[lover1Slot.id];
    const lover2 = assigned[lover2Slot.id];
    if (lover1 && lover2 && lover1 !== lover2) {
      return {
        ...state,
        loveRelationships: addPair(
          state.loveRelationships,
          lover1.id,
          lover2.id
        ),
        event: `${lover1.name} and ${lover2.name} fell in love.`,
      };
    }
    return state;
  },
};

const victimSlot = { id: "victim", label: "Victim" };
const witnessSlot = { id: "witness", label: "Witness" };
export const death: SceneTemplate = {
  id: "death",
  name: "🪦 Death",
  slots: [victimSlot, witnessSlot],
  outcomeLogic: (state, assigned) => {
    const victim = assigned[victimSlot.id];
    const witness = assigned[witnessSlot.id];
    let newState: StoryState = {
      ...state,
      event: "",
    };

    if (victim) {
      newState.characterStates = addCharacterState(
        newState.characterStates,
        victim.id,
        "dead"
      );
      newState.event = `${victim.name} died.`;
    }

    if (
      victim &&
      witness &&
      hasPair(state.loveRelationships, victim.id, witness.id)
    ) {
      newState.characterStates = addCharacterState(
        newState.characterStates,
        witness.id,
        "heartbroken"
      );
      newState.event = `${witness.name} was heartbroken by the death of ${victim.name}.`;
    }

    return newState;
  },
};

export const sceneTemplates: EntityMap<SceneTemplate> = entityMap([
  love,
  death,
]);
