import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDispatch, useSelector } from "react-redux";
import { characters } from "../characters";
import { resolve } from "../entities";
import { books } from "../puzzles";
import { isPuzzleWon } from "../puzzleUtils";
import { scenes } from "../scenes";
import { getStates } from "../simulator";
import { setCurrentPuzzleId } from "../store/gameStateSlice";
import { GameState, Puzzle } from "../types";
import { CharacterView } from "./CharacterView";
import { InsertionPoint } from "./InsertionPoint";
import { PanelView } from "./PanelView";
import { SceneView } from "./SceneView";

export const PuzzleView: React.FC<{
  puzzle: Puzzle;
  currentPuzzleId: string;
}> = ({ puzzle, currentPuzzleId }) => {
  const dispatch = useDispatch();
  const panels = useSelector((state: GameState) => state.puzzleStates[currentPuzzleId]?.panels ?? []);
  const currentBookId = useSelector((state: GameState) => state.currentBookId);
  const states = getStates(panels, puzzle.initialStoryState);
  const puzzleScenes = resolve(puzzle.scenes, scenes);
  const puzzleCharacters = resolve(puzzle.characters, characters);

  const currentBook = books[currentBookId ?? ""];
  const currentPuzzleIndex = currentBook?.puzzles.indexOf(currentPuzzleId) ?? -1;
  const hasPreviousPuzzle = currentPuzzleIndex > 0;
  const hasNextPuzzle = currentPuzzleIndex < (currentBook?.puzzles.length ?? 0) - 1;

  const handlePreviousPuzzle = () => {
    if (hasPreviousPuzzle && currentBook) {
      dispatch(setCurrentPuzzleId(currentBook.puzzles[currentPuzzleIndex - 1]));
    }
  };

  const handleNextPuzzle = () => {
    if (hasNextPuzzle && currentBook) {
      dispatch(setCurrentPuzzleId(currentBook.puzzles[currentPuzzleIndex + 1]));
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={handlePreviousPuzzle} disabled={!hasPreviousPuzzle}>
          ← Previous Puzzle
        </button>
        <button onClick={() => dispatch(setCurrentPuzzleId(null))} style={{ marginLeft: "1rem" }}>
          ↑ Back to Puzzle List
        </button>
        <button onClick={handleNextPuzzle} disabled={!hasNextPuzzle} style={{ marginLeft: "1rem" }}>
          Next Puzzle →
        </button>
      </div>
      <h1>
        {puzzle.prompt}
        {isPuzzleWon(puzzle, panels) && " - Victory"}
      </h1>
      <div style={{ display: "flex", gap: "12px" }}>
        <div>
          <div>
            <h2>Scenes:</h2>
            {puzzleScenes.map((scene) => (
              <SceneView key={scene.id} scene={scene} />
            ))}
          </div>

          <div>
            <h2>Characters:</h2>
            {puzzleCharacters.map((character) => (
              <CharacterView key={character.id} character={character} />
            ))}
          </div>
        </div>

        <div>
          <h2>
            Story ({panels.length} / {puzzle.maxPanelCount} panels):
          </h2>
          <InsertionPoint puzzle={puzzle} key={panels.length} index={0} panelCount={panels.length} />
          {panels.map((panel, index) => {
            return (
              <PanelView
                puzzle={puzzle}
                panel={panel}
                index={index}
                states={states}
                key={`${index}-${panels.length}`}
                panelCount={panels.length}
              />
            );
          })}
        </div>
      </div>
    </DndProvider>
  );
};
