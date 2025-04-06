import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPuzzleId } from "../gameStateSlice";
import { puzzles } from "../puzzles";
import { GameState } from "../types";
import { ChapterView } from "./ChapterView";
import { PuzzleView } from "./PuzzleView";

export const PuzzleBrowser: React.FC = () => {
  const currentPuzzleId = useSelector(
    (state: GameState) => state.currentPuzzleId
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
        <ChapterView />
      )}
    </div>
  );
};
