import { characters } from "./characters";
import { scenes } from "./scenes";
import { eavesdrop } from "./scenes/eavesdrop";
import { handlePreconditions } from "./scenes/sceneUtils";
import { createStateProxy } from "./stateProxy";
import { initialEvent, StoryState } from "./storyState";
import { Panel } from "./types";

function resolveMap(slotAssignedCharacters: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(slotAssignedCharacters).map(([slotId, characterId]) => [slotId, characters[characterId]])
  );
}

export function getStates(panels: Panel[], initialState: StoryState): StoryState[] {
  function computeState(previousStates: StoryState[], panel: Panel): StoryState[] {
    const previousState = previousStates[previousStates.length - 1];
    const scene = scenes[panel.sceneId];
    if (scene) {
      const assigned = resolveMap(panel.slotAssignedCharacters);
      const newState = previousState.copy();
      // Deep copy believedStoryState attributes
      newState.forEachNode((node) => {
        const believedState = newState.getNodeAttribute(node, "believedStoryState");
        if (believedState) {
          newState.setNodeAttribute(node, "believedStoryState", believedState.copy());
        }
      });

      newState.setAttribute("event", initialEvent);

      const state = createStateProxy(newState);
      const mandatorySlots = scene.slots.filter((slot) => !slot.optional);
      if (mandatorySlots.every((slot) => !assigned[slot.id])) {
        state.setDescription("Please drag and drop scenes or characters here.");
        return [...previousStates, newState];
      }
      if (mandatorySlots.length === 2) {
        if (assigned[scene.slots[0].id] !== undefined && assigned[scene.slots[1].id] === undefined) {
          if (scene.slots[0].hint !== undefined) {
            state.think(assigned[scene.slots[0].id].id, scene.slots[0].hint);
          } else {
            state.setDescription("Please drag and drop a character to the second slot.");
          }
          return [...previousStates, newState];
        } else if (assigned[scene.slots[0].id] === undefined) {
          state.setDescription("Please drag and drop a character to the first slot.");
          return [...previousStates, newState];
        }
      }

      const assignedCharacters = Object.entries(assigned)
        .filter(([slotId, _]) => !scene.slots.find((slot) => slot.id === slotId)?.nonParticipant)
        .map(([_, character]) => character);
      const participantIds = [
        ...assignedCharacters.map((character) => character.id),
        state.getGlobalState("eavesdropper")?.id,
      ].filter((id) => id !== undefined);
      const stateWithParticipants = createStateProxy(newState, participantIds);

      const commonPreconditionMatched =
        assignedCharacters[0] !== undefined && handlePreconditions(state, assignedCharacters[0], assignedCharacters[1]);
      if (!commonPreconditionMatched) {
        scene.outcomeLogic(stateWithParticipants, assigned);
      }

      if (scene.id !== eavesdrop.id) {
        state.setGlobalState("eavesdropper", undefined);
      }
      return [...previousStates, newState];
    } else {
      return previousStates;
    }
  }
  return panels.reduce(computeState, [initialState]);
}
