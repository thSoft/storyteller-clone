import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentChapterId, setCurrentPuzzleId } from "../gameStateSlice";
import { chapters, puzzles } from "../puzzles";
import { GameState } from "../types";

export const ChapterView: React.FC = () => {
  const dispatch = useDispatch();
  const chapterIds = Object.keys(chapters);
  const currentChapterId = useSelector(
    (state: GameState) => state.currentChapterId ?? chapterIds[0]
  );
  const puzzleStates = useSelector((state: GameState) => state.puzzleStates);

  const currentChapterIndex = chapters[currentChapterId]
    ? chapterIds.indexOf(currentChapterId)
    : 0;
  const currentChapter = Object.values(chapters)[currentChapterIndex];

  const handlePrev = () => {
    if (currentChapterIndex > 0) {
      dispatch(setCurrentChapterId(chapterIds[currentChapterIndex - 1]));
    }
  };

  const handleNext = () => {
    if (currentChapterIndex < chapterIds.length - 1) {
      dispatch(setCurrentChapterId(chapterIds[currentChapterIndex + 1]));
    }
  };

  return (
    <div>
      <h2>
        Chapter {currentChapterIndex + 1}: {currentChapter?.title || "Unknown"}
        {currentChapter.puzzles.every(
          (puzzleId) => puzzleStates[puzzleId]?.completed
        ) && " - Completed"}
      </h2>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={handlePrev} disabled={currentChapterIndex === 0}>
          ← Previous Chapter
        </button>
        <button
          onClick={handleNext}
          disabled={currentChapterIndex === chapterIds.length - 1}
          style={{ marginLeft: "1rem" }}
        >
          Next Chapter →
        </button>
      </div>

      <ul>
        {currentChapter?.puzzles.map((puzzleId) => (
          <li key={puzzleId}>
            {puzzleStates[puzzleId]?.completed ? "✅" : "☐"}
            <button onClick={() => dispatch(setCurrentPuzzleId(puzzleId))}>
              {puzzles[puzzleId]?.title || puzzleId}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
