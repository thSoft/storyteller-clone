import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSelector } from "react-redux";
import { characters } from "../characters";
import { resolve } from "../entities";
import { isPuzzleWon } from "../puzzleUtils";
import { scenes } from "../scenes";
import { getStates } from "../simulator";
import { GameState, Puzzle } from "../types";
import { CharacterView } from "./CharacterView";
import { InsertionPoint } from "./InsertionPoint";
import { PanelView } from "./PanelView";
import { SceneView } from "./SceneView";

export const PuzzleView: React.FC<{
  puzzle: Puzzle;
  currentPuzzleId: string;
}> = ({ puzzle, currentPuzzleId }) => {
  const panels = useSelector((state: GameState) => state.puzzleStates[currentPuzzleId]?.panels ?? []);
  const states = getStates(panels, puzzle.initialStoryState);
  const puzzleScenes = resolve(puzzle.scenes, scenes);
  const puzzleCharacters = resolve(puzzle.characters, characters);

  return (
    <DndProvider backend={HTML5Backend}>
      <h1>
        {puzzle.prompt}
        {isPuzzleWon(puzzle, panels) && " - Victory"}
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
          <h2>
            Story ({panels.length} / {puzzle.maxPanelCount} panels):
          </h2>
          <InsertionPoint puzzle={puzzle} key={panels.length} index={0} panelCount={panels.length} />
          {panels.map((panel, index) => {
            return (
              <PanelView
                puzzle={puzzle}
                panel={panel}
                index={index}
                states={states}
                key={`${index}-${panels.length}`}
                panelCount={panels.length}
              />
            );
          })}
        </div>
      </div>
    </DndProvider>
  );
};
