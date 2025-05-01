import { isPuzzleWon } from "./puzzleUtils";
import { scenes } from "./scenes";
import { Character, Panel, Puzzle, Scene } from "./types";

function testPuzzleWinCondition(puzzle: Puzzle, panels: Panel[], expectedResult: boolean) {
  const result = isPuzzleWon(puzzle, panels);
  if (expectedResult) {
    expect(result).toBeTruthy();
  } else {
    expect(result).toBeFalsy();
  }
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
    slots: { id: string; optional?: boolean }[],
    characters: string[]
  ): Record<string, string> {
    const assignedCharacters = new Set<string>();
    const slotAssignments: Record<string, string> = {};

    // First assign characters to mandatory slots
    const mandatorySlots = slots.filter((slot) => !slot.optional);
    const optionalSlots = slots.filter((slot) => slot.optional);

    // Assign to mandatory slots first
    mandatorySlots.forEach((slot) => {
      const availableCharacters = characters.filter((character) => !assignedCharacters.has(character));
      if (availableCharacters.length > 0) {
        const randomCharacter = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
        slotAssignments[slot.id] = randomCharacter;
        assignedCharacters.add(randomCharacter);
      }
    });

    // Then assign to optional slots
    optionalSlots.forEach((slot) => {
      const availableCharacters = characters.filter((character) => !assignedCharacters.has(character));
      if (availableCharacters.length > 0) {
        const randomCharacter = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
        slotAssignments[slot.id] = randomCharacter;
        assignedCharacters.add(randomCharacter);
      }
    });

    return slotAssignments;
  }

  // Helper function to randomly modify a panel
  function modifyPanel(panel: Panel): Panel {
    const modifiedPanel = deepCopyPanel(panel); // Use deep copy to avoid modifying the original panel

    // Randomly decide whether to change the scene or modify character assignments
    if (Math.random() < 0.5) {
      // Change the scene
      const randomSceneId = puzzle.scenes[Math.floor(Math.random() * puzzle.scenes.length)];
      modifiedPanel.sceneId = randomSceneId;
      modifiedPanel.slotAssignedCharacters = {};

      // Update character assignments based on the new scene's slots
      const newScene = scenes[randomSceneId];
      if (newScene) {
        // First assign characters to mandatory slots
        const mandatorySlots = newScene.slots.filter((slot) => !slot.optional);
        const optionalSlots = newScene.slots.filter((slot) => slot.optional);

        // Assign characters to mandatory slots first
        const mandatoryAssignments = assignCharactersToSlots(mandatorySlots, characters);
        Object.assign(modifiedPanel.slotAssignedCharacters, mandatoryAssignments);

        // Then assign remaining characters to optional slots
        const remainingCharacters = characters.filter((char) => !Object.values(mandatoryAssignments).includes(char));
        const optionalAssignments = assignCharactersToSlots(optionalSlots, remainingCharacters);
        Object.assign(modifiedPanel.slotAssignedCharacters, optionalAssignments);
      }
    } else {
      // Modify character assignments while respecting mandatory slots
      const currentScene = scenes[modifiedPanel.sceneId];
      if (currentScene) {
        const mandatorySlots = currentScene.slots.filter((slot) => !slot.optional);
        const optionalSlots = currentScene.slots.filter((slot) => slot.optional);

        // Only modify optional slots or ensure mandatory slots have assignments
        const slotsToModify = [...optionalSlots];
        if (mandatorySlots.some((slot) => !modifiedPanel.slotAssignedCharacters[slot.id])) {
          slotsToModify.push(...mandatorySlots.filter((slot) => !modifiedPanel.slotAssignedCharacters[slot.id]));
        }

        if (slotsToModify.length > 0) {
          const randomSlot = slotsToModify[Math.floor(Math.random() * slotsToModify.length)];
          const assignedCharacters = new Set(Object.values(modifiedPanel.slotAssignedCharacters));

          // Filter out characters already assigned to other slots
          const availableCharacters = characters.filter((character) => !assignedCharacters.has(character));

          if (availableCharacters.length > 0) {
            const randomCharacter = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
            modifiedPanel.slotAssignedCharacters[randomSlot.id] = randomCharacter;
          }
        }
      }
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
      modifiedSolution[randomIndex] = modifyPanel(modifiedSolution[randomIndex]);
    }

    return modifiedSolution;
  }

  // Generate new solutions by modifying known valid solutions
  for (const knownSolution of knownValidSolutions) {
    for (let i = 0; i < maxModifications; i++) {
      const newSolution = modifySolution(knownSolution);

      // Check if the new solution satisfies the win condition
      if (isPuzzleWon(puzzle, newSolution)) {
        // Ensure the solution is unique
        if (
          !knownValidSolutions.some((known) => isEqualSolution(known, newSolution)) &&
          !generatedSolutions.some((generated) => isEqualSolution(generated, newSolution))
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
      isEqual(panel.slotAssignedCharacters, solution2[index].slotAssignedCharacters)
  );
}

// Helper function to compare two objects for equality
function isEqual(obj1: Record<string, string>, obj2: Record<string, string>): boolean {
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
export function runPuzzleTests(puzzle: Puzzle, validSolutions: Panel[][], invalidSolutions: Panel[][]) {
  describe(`Puzzle: ${puzzle.title}`, () => {
    validSolutions.forEach((validPanels, index) => {
      it(`should satisfy the win condition with valid solution #${index + 1}`, () => {
        testPuzzleWinCondition(puzzle, validPanels, true);
      });
    });

    invalidSolutions.forEach((invalidPanels, index) => {
      it(`should not satisfy the win condition with invalid solution #${index + 1}`, () => {
        testPuzzleWinCondition(puzzle, invalidPanels, false);
      });
    });

    generateMoreValidSolutions(puzzle, validSolutions, 100).forEach((panels, index) => {
      it(`has another valid solution #${index + 1}`, () => {
        console.log(panels);
      });
    });
  });
}

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
