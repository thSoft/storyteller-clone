import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import { addPanelToCurrentPuzzle } from "../store/gameStateSlice";
import { GameState, Puzzle } from "../types";
import { ItemTypes } from "./ItemTypes";

export const InsertionPoint: React.FC<{
  puzzle: Puzzle;
  index: number;
}> = ({ puzzle, index }) => {
  const dispatch = useDispatch();
  const panels = useSelector(
    (state: GameState) =>
      state.puzzleStates[state.currentPuzzleId!]?.panels ?? []
  );

  const handleInsertPanel = (index: number, sceneId: string) => {
    if (panels.length < puzzle.maxPanelCount) {
      dispatch(
        addPanelToCurrentPuzzle({
          panel: {
            sceneId,
            slotAssignedCharacters: {},
          },
          index: index,
        })
      );
    }
  };

  const [{ dragging }, drop] = useDrop(() => ({
    accept: ItemTypes.SCENE,
    canDrop: () => panels.length < puzzle.maxPanelCount, // Disallow dropping if maxPanelCount is reached
    drop: (item: { sceneId: string }) => handleInsertPanel(index, item.sceneId),
    collect: (monitor) => ({
      dragging: !!monitor.canDrop(),
    }),
  }));

  const ref = useRef<HTMLDivElement>(null);
  drop(ref);

  return (
    <div
      ref={ref}
      style={{
        height: "16px",
        backgroundColor:
          panels.length < puzzle.maxPanelCount && dragging
            ? "lightgreen"
            : "transparent",
        margin: "4px 0",
      }}
    />
  );
};
