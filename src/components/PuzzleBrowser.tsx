import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPuzzleId } from "../gameStateSlice";
import { puzzles } from "../puzzles";
import { RootState } from "../store";
import { CurrentChapterView } from "./CurrentChapterView";
import { PuzzleView } from "./PuzzleView";

export const PuzzleBrowser: React.FC = () => {
  const currentPuzzleId = useSelector(
    (state: RootState) => state.gameState.currentPuzzleId
  );
  const dispatch = useDispatch();

  const puzzle = currentPuzzleId ? puzzles[currentPuzzleId] : null;

  return (
    <div style={{ padding: "1rem" }}>
      {currentPuzzleId && puzzle ? (
        <>
          <button onClick={() => dispatch(setCurrentPuzzleId(null))}>
            ← Back to Puzzle List
          </button>
          <PuzzleView puzzle={puzzle} currentPuzzleId={currentPuzzleId} />
        </>
      ) : (
        <CurrentChapterView />
      )}
    </div>
  );
};
