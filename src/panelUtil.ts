import { Scene, Character, Panel } from "./types";

/**
 * Utility to create a Panel object with proper slot assignments.
 */
export function panel(scene: Scene, ...assignments: Character[]): Panel {
  return {
    sceneId: scene.id,
    slotAssignedCharacters: assignments.reduce(
      (result, assignment, index) => ({
        ...result,
        [scene.slots[index].id]: assignment.id,
      }),
      {} as Record<string, string>
    ),
  };
}
