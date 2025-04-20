import { produce } from "immer";
import { characters } from "./characters";
import { scenes } from "./scenes";
import { StoryState, cloneGraph } from "./storyState";
import { Panel } from "./types";

function resolveMap(slotAssignedCharacters: Record<string, string>) {
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
          draft.graph = cloneGraph(draft.graph);
          scene.outcomeLogic(draft, assigned);
        }),
      ];
    } else {
      return previousStates;
    }
  }
  return panels.reduce(computeState, [initialState]);
}
