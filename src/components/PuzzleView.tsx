import { produce } from "immer";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSelector } from "react-redux";
import { characters } from "../characters";
import { scenes } from "../scenes";
import { RootState } from "../store";
import { Panel, Puzzle, StoryState } from "../types";
import { resolve, resolveMap } from "../utils";
import { DraggableCharacter } from "./DraggableCharacter";
import { DraggableScene } from "./DraggableScene";
import { InsertionPoint } from "./InsertionPoint";
import { PanelView } from "./PanelView";

function getStates(panels: Panel[], initialState: StoryState): StoryState[] {
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

export const PuzzleView: React.FC<{
  puzzle: Puzzle;
  currentPuzzleId: string;
}> = ({ puzzle, currentPuzzleId }) => {
  const panels = useSelector(
    (state: RootState) => state.puzzleStates[currentPuzzleId]?.panels ?? []
  );
  const states = getStates(panels, puzzle.initialStoryState);
  const puzzleScenes = resolve(puzzle.scenes, scenes);
  const puzzleCharacters = resolve(puzzle.characters, characters);

  return (
    <DndProvider backend={HTML5Backend}>
      <h1>
        {puzzle.prompt}
        {puzzle.isWinning(states[states.length - 1]) && " - Victory"}
      </h1>
      <div style={{ display: "flex", gap: "12px" }}>
        <div>
          <div>
            <h2>Scenes:</h2>
            {puzzleScenes.map((scene) => (
              <DraggableScene key={scene.id} scene={scene} />
            ))}
          </div>

          <div>
            <h2>Characters:</h2>
            {puzzleCharacters.map((character) => (
              <DraggableCharacter key={character.id} character={character} />
            ))}
          </div>
        </div>

        <div>
          <h2>Story:</h2>
          <InsertionPoint index={0} />
          {panels.map((panel, index) => {
            return (
              <PanelView
                panel={panel}
                index={index}
                states={states}
                key={index}
              />
            );
          })}
        </div>
      </div>
    </DndProvider>
  );
};
