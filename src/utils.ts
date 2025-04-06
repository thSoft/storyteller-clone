import { produce } from "immer";
import { characters } from "./characters";
import { scenes } from "./scenes";
import { StoryState } from "./storyState";
import { Entity, EntityMap, Panel } from "./types";

export function entityMap<T extends Entity>(items: T[]): EntityMap<T> {
  const result = Object.fromEntries(items.map((item) => [item.id, item]));
  if (Object.keys(result).length !== items.length) {
    throw new Error("Duplicate entity IDs found.");
  }
  return result;
}

export function resolve<T extends Entity>(
  ids: string[],
  map: EntityMap<T>
): T[] {
  return ids.map((id) => map[id]);
}

export function resolveMap(slotAssignedCharacters: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(slotAssignedCharacters).map(([slotId, characterId]) => [
      slotId,
      characters[characterId],
    ])
  );
}

export function getStates(
  panels: Panel[],
  initialState: StoryState
): StoryState[] {
  function computeState(
    previousStates: StoryState[],
    panel: Panel
  ): StoryState[] {
    const previousState = previousStates[previousStates.length - 1];
    const scene = scenes[panel.sceneId];
    if (scene) {
      const assigned = resolveMap(panel.slotAssignedCharacters);
      return [
        ...previousStates,
        produce(previousState, (draft) => {
          draft.event = undefined;
          scene.outcomeLogic(draft, assigned);
        }),
      ];
    } else {
      return previousStates;
    }
  }
  return panels.reduce(computeState, [initialState]);
}
