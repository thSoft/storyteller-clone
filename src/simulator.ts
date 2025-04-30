import { produce } from "immer";
import { characters } from "./characters";
import { scenes } from "./scenes";
import { eavesdrop } from "./scenes/eavesdrop";
import { getRelated, setGlobalState } from "./scenes/sceneUtils";
import { StoryState } from "./storyState";
import { Character, CharacterWithImpersonation, Panel } from "./types";

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
      const assignedWithImpersonation = handleImpersonation(previousState, assigned);
      return [
        ...previousStates,
        produce(previousState, (draft) => {
          const unassignedSlots = scene.slots.filter((slot) => !slot.optional && !assigned[slot.id]);
          if (unassignedSlots.length > 0) {
            draft.event = "Please drag and drop characters to the slots that are not optional.";
            return;
          }
          draft.event = undefined;
          draft.graph = draft.graph.copy();
          scene.outcomeLogic(draft, assignedWithImpersonation);

          if (scene.id !== eavesdrop.id) {
            setGlobalState(draft, "eavesdropperId", undefined);
          }
        }),
      ];
    } else {
      return previousStates;
    }
  }
  return panels.reduce(computeState, [initialState]);
}

function handleImpersonation(
  state: StoryState,
  assigned: Record<string, Character>
): Record<string, CharacterWithImpersonation> {
  const result = Object.entries(assigned)
    .filter(([_, value]) => value !== undefined)
    .map(([slotId, character]) => {
      const impersonatedIds = getRelated(state, character.id, "impersonates");
      const actually = character;
      const seemingly = impersonatedIds.length > 0 ? characters[impersonatedIds[0]] : character;
      const name =
        impersonatedIds.length > 0 ? `seemingly ${seemingly.name} (actually ${character.name})` : character.name;
      return [slotId, { ...character, seemingly, actually, name }];
    });
  return Object.fromEntries(result);
}
