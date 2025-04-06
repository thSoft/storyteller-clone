import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSelector } from "react-redux";
import { characters } from "../characters";
import { scenes } from "../scenes";
import { GameState, Puzzle } from "../types";
import { getStates, resolve } from "../utils";
import { CharacterView } from "./CharacterView";
import { InsertionPoint } from "./InsertionPoint";
import { PanelView } from "./PanelView";
import { SceneView } from "./SceneView";

export const PuzzleView: React.FC<{
  puzzle: Puzzle;
  currentPuzzleId: string;
}> = ({ puzzle, currentPuzzleId }) => {
  const panels = useSelector(
    (state: GameState) => state.puzzleStates[currentPuzzleId]?.panels ?? []
  );
  const states = getStates(panels, puzzle.initialStoryState);
  const puzzleScenes = resolve(puzzle.scenes, scenes);
  const puzzleCharacters = resolve(puzzle.characters, characters);

  return (
    <DndProvider backend={HTML5Backend}>
      <h1>
        {puzzle.prompt}
        {puzzle.isWinning(states[states.length - 1]) && " - Victory"}
      </h1>
      <div style={{ display: "flex", gap: "12px" }}>
        <div>
          <div>
            <h2>Scenes:</h2>
            {puzzleScenes.map((scene) => (
              <SceneView key={scene.id} scene={scene} />
            ))}
          </div>

          <div>
            <h2>Characters:</h2>
            {puzzleCharacters.map((character) => (
              <CharacterView key={character.id} character={character} />
            ))}
          </div>
        </div>

        <div>
          <h2>Story:</h2>
          <InsertionPoint index={0} />
          {panels.map((panel, index) => {
            return (
              <PanelView
                panel={panel}
                index={index}
                states={states}
                key={index}
              />
            );
          })}
        </div>
      </div>
    </DndProvider>
  );
};
