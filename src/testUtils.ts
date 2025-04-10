import { scenes } from "./scenes";
import { getStates } from "./simulator";
import { Character, Panel, Puzzle, Scene } from "./types";

function testPuzzleWinCondition(
  puzzle: Puzzle,
  panels: Panel[],
  expectedResult: boolean
) {
  const states = getStates(panels, puzzle.initialStoryState);
  const finalState = states[states.length - 1];
  expect(puzzle.isWinning(finalState)).toBe(expectedResult);
}

/**
 * Generate valid solutions different from knownValidSolutions
 * by modifying them randomly.
 */
function generateMoreValidSolutions(
  puzzle: Puzzle,
  knownValidSolutions: Panel[][],
  maxModifications: number
): Panel[][] {
  const generatedSolutions: Panel[][] = [];
  const { characters } = puzzle;

  // Helper function to deep copy a panel
  function deepCopyPanel(panel: Panel): Panel {
    return {
      sceneId: panel.sceneId,
      slotAssignedCharacters: { ...panel.slotAssignedCharacters },
    };
  }

  // Helper function to assign characters to slots without duplicates
  function assignCharactersToSlots(
    slots: { id: string }[],
    characters: string[]
  ): Record<string, string> {
    const assignedCharacters = new Set<string>();
    const slotAssignments: Record<string, string> = {};

    slots.forEach((slot) => {
      // Filter out characters already assigned to other slots
      const availableCharacters = characters.filter(
        (character) => !assignedCharacters.has(character)
      );

      const randomCharacter =
        availableCharacters[
          Math.floor(Math.random() * availableCharacters.length)
        ];
      slotAssignments[slot.id] = randomCharacter;
      assignedCharacters.add(randomCharacter); // Mark the character as assigned
    });

    return slotAssignments;
  }

  // Helper function to randomly modify a panel
  function modifyPanel(panel: Panel): Panel {
    const modifiedPanel = deepCopyPanel(panel); // Use deep copy to avoid modifying the original panel

    // Randomly decide whether to change the scene or modify character assignments
    if (Math.random() < 0.5) {
      // Change the scene
      const randomSceneId =
        puzzle.scenes[Math.floor(Math.random() * puzzle.scenes.length)];
      modifiedPanel.sceneId = randomSceneId;

      // Update character assignments based on the new scene's slots
      const newScene = scenes[randomSceneId];
      if (newScene) {
        modifiedPanel.slotAssignedCharacters = assignCharactersToSlots(
          newScene.slots,
          characters
        );
      }
    } else {
      // Modify character assignments
      const slotIds = Object.keys(modifiedPanel.slotAssignedCharacters);
      const randomSlot = slotIds[Math.floor(Math.random() * slotIds.length)];
      const assignedCharacters = new Set(
        Object.values(modifiedPanel.slotAssignedCharacters)
      );

      // Filter out characters already assigned to other slots
      const availableCharacters = characters.filter(
        (character) => !assignedCharacters.has(character)
      );

      const randomCharacter =
        availableCharacters[
          Math.floor(Math.random() * availableCharacters.length)
        ];
      modifiedPanel.slotAssignedCharacters[randomSlot] = randomCharacter;
    }

    return modifiedPanel;
  }

  // Helper function to modify an entire solution
  function modifySolution(solution: Panel[]): Panel[] {
    const modifiedSolution = solution.map(deepCopyPanel); // Deep copy the entire solution

    // Apply a random number of modifications (up to maxModifications)
    const numModifications = Math.floor(Math.random() * maxModifications) + 1;
    for (let i = 0; i < numModifications; i++) {
      const randomIndex = Math.floor(Math.random() * modifiedSolution.length);
      modifiedSolution[randomIndex] = modifyPanel(
        modifiedSolution[randomIndex]
      );
    }

    return modifiedSolution;
  }

  // Generate new solutions by modifying known valid solutions
  for (const knownSolution of knownValidSolutions) {
    for (let i = 0; i < maxModifications; i++) {
      const newSolution = modifySolution(knownSolution);

      // Check if the new solution satisfies the win condition
      if (
        puzzle.isWinning(
          getStates(newSolution, puzzle.initialStoryState).pop()!
        )
      ) {
        // Ensure the solution is unique
        if (
          !knownValidSolutions.some((known) =>
            isEqualSolution(known, newSolution)
          ) &&
          !generatedSolutions.some((generated) =>
            isEqualSolution(generated, newSolution)
          )
        ) {
          generatedSolutions.push(newSolution);
        }
      }
    }
  }

  return generatedSolutions;
}

// Helper function to check if two solutions are equal
function isEqualSolution(solution1: Panel[], solution2: Panel[]): boolean {
  if (solution1.length !== solution2.length) return false;
  return solution1.every(
    (panel, index) =>
      panel.sceneId === solution2[index].sceneId &&
      isEqual(
        panel.slotAssignedCharacters,
        solution2[index].slotAssignedCharacters
      )
  );
}

// Helper function to compare two objects for equality
function isEqual(
  obj1: Record<string, string>,
  obj2: Record<string, string>
): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  return keys1.every((key) => obj1[key] === obj2[key]);
}

/**
 * Runs tests for a puzzle with given valid and invalid solutions.
 * @param puzzle The puzzle to test.
 * @param validSolutions Array of Panel[] that should satisfy the win condition.
 * @param invalidSolutions Array of Panel[] that should not satisfy the win condition.
 */
export function runPuzzleTests(
  puzzle: Puzzle,
  validSolutions: Panel[][],
  invalidSolutions: Panel[][]
) {
  describe(`Puzzle: ${puzzle.title}`, () => {
    validSolutions.forEach((validPanels, index) => {
      it(`should satisfy the win condition with valid solution #${
        index + 1
      }`, () => {
        testPuzzleWinCondition(puzzle, validPanels, true);
      });
    });

    invalidSolutions.forEach((invalidPanels, index) => {
      it(`should not satisfy the win condition with invalid solution #${
        index + 1
      }`, () => {
        testPuzzleWinCondition(puzzle, invalidPanels, false);
      });
    });

    generateMoreValidSolutions(puzzle, validSolutions, 100).forEach(
      (panels, index) => {
        it(`has another valid solution #${index + 1}`, () => {
          console.log(panels);
        });
      }
    );
  });
}

export function panel(scene: Scene, ...assignments: Character[]): Panel {
  return {
    sceneId: scene.id,
    slotAssignedCharacters: scene.slots.reduce(
      (result, slot, index) => ({
        ...result,
        [slot.id]: assignments[index].id,
      }),
      {} as Record<string, string>
    ),
  };
}
