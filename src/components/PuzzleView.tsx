import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDispatch, useSelector } from "react-redux";
import { characters, mafiaCharacters } from "../characters";
import { resolve } from "../entities";
import { books } from "../puzzles";
import { getPuzzleTooltip, isPuzzleEnabled, isPuzzleWon } from "../puzzleUtils";
import { mafiaScenes, scenes } from "../scenes";
import { getStates } from "../simulator";
import { setCurrentPuzzleId } from "../store/gameStateSlice";
import { GameState, Puzzle } from "../types";
import { DraggableCharacterView } from "./DraggableCharacterView";
import { PanelView } from "./PanelView";
import { SceneView } from "./SceneView";

export const PuzzleView: React.FC<{
  puzzle: Puzzle;
  currentPuzzleId: string;
}> = ({ puzzle, currentPuzzleId }) => {
  const dispatch = useDispatch();
  const puzzleStates = useSelector((state: GameState) => state.puzzleStates);
  const panels = useSelector((state: GameState) => state.puzzleStates[currentPuzzleId]?.panels ?? []);
  const currentBookId = useSelector((state: GameState) => state.currentBookId);
  const states = getStates(panels, puzzle.initialStoryState);
  const puzzleScenes = resolve(puzzle.scenes, scenes);
  const puzzleCharacters = resolve(puzzle.characters, characters);

  const currentBook = books[currentBookId ?? ""];
  const currentPuzzleIndex = currentBook?.puzzles.indexOf(currentPuzzleId) ?? -1;
  const hasPreviousPuzzle = currentPuzzleIndex > 0;
  const hasNextPuzzle = currentPuzzleIndex < (currentBook?.puzzles.length ?? 0) - 1;

  const nextPuzzleId = hasNextPuzzle && currentBook ? currentBook.puzzles[currentPuzzleIndex + 1] : null;
  const isNextPuzzleEnabled = nextPuzzleId ? isPuzzleEnabled(nextPuzzleId, puzzleStates) : false;
  const nextPuzzleTooltip = nextPuzzleId ? getPuzzleTooltip(nextPuzzleId, puzzleStates) : undefined;

  const handlePreviousPuzzle = () => {
    if (hasPreviousPuzzle && currentBook) {
      dispatch(setCurrentPuzzleId(currentBook.puzzles[currentPuzzleIndex - 1]));
    }
  };

  const handleNextPuzzle = () => {
    if (hasNextPuzzle && currentBook && isNextPuzzleEnabled) {
      dispatch(setCurrentPuzzleId(currentBook.puzzles[currentPuzzleIndex + 1]));
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ marginBottom: "1rem", textAlign: "center" }}>
        <button onClick={handlePreviousPuzzle} disabled={!hasPreviousPuzzle}>
          ← Previous Puzzle
        </button>
        <button onClick={() => dispatch(setCurrentPuzzleId(null))} style={{ marginLeft: "1rem" }}>
          ↑ Back to Puzzle List
        </button>
        <button
          onClick={handleNextPuzzle}
          disabled={!isNextPuzzleEnabled}
          style={{ marginLeft: "1rem" }}
          title={nextPuzzleTooltip}
        >
          Next Puzzle →
        </button>
      </div>
      <h1 style={{ textAlign: "center" }}>
        {puzzle.prompt}
        {isPuzzleWon(puzzle, panels) && " 🎉"}
      </h1>
      <div style={{ display: "flex", gap: "12px" }}>
        <div style={{ width: "30vw" }}>
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {mafiaScenes.map((sceneId) => {
                const scene = scenes[sceneId];
                return <SceneView key={sceneId} scene={scene} visible={puzzleScenes.includes(scene)} />;
              })}
            </div>
          </div>
          <hr />
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              {mafiaCharacters.map((characterId) => {
                const character = characters[characterId];
                return (
                  <DraggableCharacterView
                    key={characterId}
                    character={character}
                    visible={puzzleCharacters.includes(character)}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ width: "70vw" }}>
          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "8px" }}>
            {panels.map((panel, index) => {
              return (
                <PanelView
                  puzzle={puzzle}
                  panel={panel}
                  index={index}
                  states={states}
                  key={`${index}-${panels.length}-${puzzleStates[currentPuzzleId]?.panels[index]}`}
                  panelCount={panels.length}
                />
              );
            })}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};
