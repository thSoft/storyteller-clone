import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentChapterIndex, setCurrentPuzzleId } from "../gameStateSlice";
import { chapters, puzzles } from "../puzzles";
import { RootState } from "../store";

type Props = {};

export const CurrentChapterView: React.FC<Props> = ({}) => {
  const dispatch = useDispatch();
  const currentChapterIndex = useSelector(
    (state: RootState) => state.currentChapterIndex
  );

  const currentChapter = chapters[currentChapterIndex];

  const handlePrev = () => {
    if (currentChapterIndex > 0) {
      dispatch(setCurrentChapterIndex(currentChapterIndex - 1));
    }
  };

  const handleNext = () => {
    if (currentChapterIndex < chapters.length - 1) {
      dispatch(setCurrentChapterIndex(currentChapterIndex + 1));
    }
  };

  return (
    <div>
      <h2>Chapter {currentChapterIndex + 1}</h2>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={handlePrev} disabled={currentChapterIndex === 0}>
          ← Previous Chapter
        </button>
        <button
          onClick={handleNext}
          disabled={currentChapterIndex === chapters.length - 1}
          style={{ marginLeft: "1rem" }}
        >
          Next Chapter →
        </button>
      </div>

      <ul>
        {currentChapter.puzzles.map((puzzleId) => (
          <li key={puzzleId}>
            <button onClick={() => dispatch(setCurrentPuzzleId(puzzleId))}>
              {puzzles[puzzleId]?.title || puzzleId}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
