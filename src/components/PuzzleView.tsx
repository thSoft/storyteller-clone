import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSelector } from "react-redux";
import { characters } from "../characters";
import { sceneTemplates } from "../sceneTemplates";
import { RootState } from "../store";
import { Puzzle, StoryBeat, StoryState } from "../types";
import { resolve } from "../utils";
import { DraggableCharacter } from "./DraggableCharacter";
import { DraggableScene } from "./DraggableScene";
import { InsertionPoint } from "./InsertionPoint";
import { StoryBeatView } from "./StoryBeatView";

function getStates(beats: StoryBeat[], initialState: StoryState): StoryState[] {
  function computeState(
    previousStates: StoryState[],
    beat: StoryBeat
  ): StoryState[] {
    const previousState = previousStates[previousStates.length - 1];
    const template = sceneTemplates[beat.templateId];
    if (template) {
      return [
        ...previousStates,
        template.outcomeLogic(previousState, beat.slotAssignedCharacters),
      ];
    } else {
      return previousStates;
    }
  }
  return beats.reduce(computeState, [initialState]);
}

export const PuzzleView: React.FC<{
  puzzle: Puzzle;
  currentPuzzleId: string;
}> = ({ puzzle, currentPuzzleId }) => {
  const gameState = useSelector((state: RootState) => state.gameState);

  const puzzleState = gameState.puzzleStates[currentPuzzleId];
  const storyBeats = puzzleState.storyBeats;

  const states = getStates(storyBeats, puzzle.initialStoryState);

  const puzzleSceneTemplates = resolve(puzzle.sceneTemplates, sceneTemplates);
  const puzzleCharacters = resolve(puzzle.characters, characters);

  return (
    <DndProvider backend={HTML5Backend}>
      <h1>
        {puzzle.title}
        {puzzle.isWinning(states[states.length - 1]) && " - Victory"}
      </h1>
      <div style={{ display: "flex", gap: "12px" }}>
        <div>
          <div>
            <h2>Scenes:</h2>
            {puzzleSceneTemplates.map((template) => (
              <DraggableScene key={template.id} template={template} />
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
          {storyBeats.map((beat, index) => {
            return (
              <StoryBeatView
                beat={beat}
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
