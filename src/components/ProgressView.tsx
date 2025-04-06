import { useSelector } from "react-redux";
import { GameState } from "../types";

export function ProgressView() {
  const completedPuzzleCount = useSelector(
    (state: GameState) =>
      Object.values(state.puzzleStates).filter((puzzle) => puzzle.completed)
        .length
  );
  const allPuzzleCount = useSelector(
    (state: GameState) => Object.values(state.puzzleStates).length
  );
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
      Progress: {completedPuzzleCount} / {allPuzzleCount} (
      {Math.round(
        (allPuzzleCount === 0 ? 0 : completedPuzzleCount / allPuzzleCount) * 100
      )}
      %)
    </div>
  );
}
