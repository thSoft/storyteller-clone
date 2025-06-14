import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { books, puzzles } from "../puzzles";
import { getPuzzleTooltip, isPuzzleEnabled } from "../puzzleUtils";
import { setCurrentPuzzleId } from "../store/gameStateSlice";
import { GameState } from "../types";

export const BookView: React.FC = () => {
  const dispatch = useDispatch();
  const puzzleStates = useSelector((state: GameState) => state.puzzleStates);
  const bookIds = Object.keys(books);
  const currentBookId = useSelector((state: GameState) => state.currentBookId ?? bookIds[0]);

  const currentBookIndex = books[currentBookId] ? bookIds.indexOf(currentBookId) : 0;
  const currentBook = Object.values(books)[currentBookIndex];

  return (
    <div>
      <h2>
        Twisted Tales: {currentBook?.title || "Unknown"}
        {currentBook.puzzles.every((puzzleId) => puzzleStates[puzzleId]?.completed) && " - Completed"}
      </h2>
      Create alternative stories based on the given prompts!
      <ul>
        {currentBook?.puzzles.map((puzzleId) => {
          const enabled = isPuzzleEnabled(puzzleId, puzzleStates);
          const tooltip = getPuzzleTooltip(puzzleId, puzzleStates);
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
