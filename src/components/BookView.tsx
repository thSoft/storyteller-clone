import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { books, puzzles } from "../puzzles";
import { getPuzzleTooltip, isPuzzleEnabled } from "../puzzleUtils";
import { setCurrentBookId, setCurrentPuzzleId } from "../store/gameStateSlice";
import { GameState } from "../types";

export const BookView: React.FC = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state: GameState) => state);
  const bookIds = Object.keys(books);
  const currentBookId = useSelector((state: GameState) => state.currentBookId ?? bookIds[0]);
  const puzzleStates = useSelector((state: GameState) => state.puzzleStates);

  const currentBookIndex = books[currentBookId] ? bookIds.indexOf(currentBookId) : 0;
  const currentBook = Object.values(books)[currentBookIndex];

  const handlePrev = () => {
    if (currentBookIndex > 0) {
      dispatch(setCurrentBookId(bookIds[currentBookIndex - 1]));
    }
  };

  const handleNext = () => {
    if (currentBookIndex < bookIds.length - 1) {
      dispatch(setCurrentBookId(bookIds[currentBookIndex + 1]));
    }
  };

  return (
    <div>
      <h2>
        Book {currentBookIndex + 1}: {currentBook?.title || "Unknown"}
        {currentBook.puzzles.every((puzzleId) => puzzleStates[puzzleId]?.completed) && " - Completed"}
      </h2>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={handlePrev} disabled={currentBookIndex === 0}>
          ← Previous Book
        </button>
        <button onClick={handleNext} disabled={currentBookIndex === bookIds.length - 1} style={{ marginLeft: "1rem" }}>
          Next Book →
        </button>
      </div>

      <ul>
        {currentBook?.puzzles.map((puzzleId) => {
          const enabled = isPuzzleEnabled(puzzleId, gameState);
          const tooltip = getPuzzleTooltip(puzzleId, gameState);
          return (
            <li key={puzzleId}>
              {puzzleStates[puzzleId]?.completed ? "✅" : "☐"}
              <button onClick={() => dispatch(setCurrentPuzzleId(puzzleId))} disabled={!enabled} title={tooltip}>
                {puzzles[puzzleId]?.title || puzzleId}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
