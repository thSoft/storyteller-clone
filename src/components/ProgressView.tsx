import { useSelector } from "react-redux";
import { puzzles } from "../puzzles";
import { GameState } from "../types";

export function ProgressView() {
  const completedPuzzleCount = useSelector((state: GameState) =>
    Math.min(
      Object.values(state.puzzleStates).filter((puzzle) => puzzle.completed)
        .length,
      Object.keys(puzzles).length
    )
  );
  const totalPuzzleCount = Object.keys(puzzles).length;
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        padding: "10px",
        backgroundColor: "white",
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "black",
      }}
    >
      Progress: {completedPuzzleCount} / {totalPuzzleCount} (
      {Math.round(
        (totalPuzzleCount === 0 ? 0 : completedPuzzleCount / totalPuzzleCount) *
          100
      )}
      %)
    </div>
  );
}
