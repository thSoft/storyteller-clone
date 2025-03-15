import { characters } from "./characters";
import { EntityMap, SceneTemplate, StoryState } from "./types";
import { addCharacterState, addPair, entityMap, hasPair } from "./utils";

// Scene Templates

export const sceneTemplates: EntityMap<SceneTemplate> = entityMap([
  {
    id: "love",
    name: "❤️ Love Scene",
    slots: [
      { id: "partner1", label: "Lover 1" },
      { id: "partner2", label: "Lover 2" },
    ],
    outcomeLogic: (state, assigned) => {
      const partner1 = characters[assigned["partner1"]];
      const partner2 = characters[assigned["partner2"]];
      if (partner1 && partner2 && partner1 !== partner2) {
        return {
          ...state,
          loveRelationships: addPair(
            state.loveRelationships,
            partner1.id,
            partner2.id
          ),
          event: `${partner1.name} and ${partner2.name} fell in love.`,
        };
      }
      return state;
    },
  },
  {
    id: "death",
    name: "🪦 Death Scene",
    slots: [
      { id: "victim", label: "Victim" },
      { id: "witness", label: "Witness" },
    ],
    outcomeLogic: (state, assigned) => {
      const victim = characters[assigned["victim"]];
      const witness = characters[assigned["witness"]];
      let newState: StoryState = {
        ...state,
        characterStates: { ...state.characterStates },
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
  },
]);
