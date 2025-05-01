import React from "react";
import { useSelector } from "react-redux";
import { puzzles } from "../puzzles";
import { GameState } from "../types";
import { BookView } from "./BookView";
import { PuzzleView } from "./PuzzleView";

export const PuzzleBrowser: React.FC = () => {
  const currentPuzzleId = useSelector((state: GameState) => state.currentPuzzleId);

  const puzzle = currentPuzzleId ? puzzles[currentPuzzleId] : null;

  return (
    <div style={{ padding: "1rem" }}>
      {currentPuzzleId && puzzle ? <PuzzleView puzzle={puzzle} currentPuzzleId={currentPuzzleId} /> : <BookView />}
    </div>
  );
};
