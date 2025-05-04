import { characters } from "./characters";
import { scenes } from "./scenes";
import { eavesdrop } from "./scenes/eavesdrop";
import { createStateProxy } from "./stateProxy";
import { initialEvent, StoryState } from "./storyState";
import { Panel } from "./types";

// Public functions

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
      const state = createStateProxy(newState);
      const unassignedSlots = scene.slots.filter((slot) => !slot.optional && !assigned[slot.id]);
      if (unassignedSlots.length > 0) {
        state.setDescription("Please drag and drop characters to the slots that are not optional.");
        return [...previousStates, newState];
      }

      const participantIds = [
        ...Object.values(assigned).map((character) => character.id),
        state.getGlobalState("eavesdropper")?.id,
      ].filter((id) => id !== undefined);
      const stateWithParticipants = createStateProxy(newState, participantIds);

      newState.setAttribute("event", initialEvent);
      scene.outcomeLogic(stateWithParticipants, assigned);

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
