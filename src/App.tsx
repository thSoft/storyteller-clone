import React from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDispatch, useSelector } from "react-redux";
import { characters } from "./characters";
import {
  addStoryBeatToCurrentPuzzle,
  removeStoryBeatFromCurrentPuzzle,
  setSlotCharacter,
} from "./gameStateSlice";
import { puzzles } from "./puzzles";
import { sceneTemplates } from "./sceneTemplates";
import { RootState } from "./store";
import {
  Character,
  Entity,
  EntityMap,
  SceneSlot,
  SceneTemplate,
  StoryBeat,
  StoryState,
} from "./types";

function getStates(beats: StoryBeat[], initialState: StoryState): StoryState[] {
  function computeState(
    previousStates: StoryState[],
    beat: StoryBeat
  ): StoryState[] {
    const previousState = previousStates[previousStates.length - 1];
    const template = sceneTemplates[beat.templateId];
    if (template) {
      return [
        ...previousStates,
        template.outcomeLogic(previousState, beat.slotAssignedCharacters),
      ];
    } else {
      return previousStates;
    }
  }
  return beats.reduce(computeState, [initialState]);
}

// Drag Item Types
const ItemTypes = {
  SCENE: "SCENE",
  CHARACTER: "CHARACTER",
};

// Draggable Scene Component
const DraggableScene: React.FC<{ template: SceneTemplate }> = ({
  template,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.SCENE,
    item: { templateId: template.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        margin: "4px",
        padding: "4px",
        border: "1px solid",
      }}
    >
      {template.name}
    </div>
  );
};

// Draggable Character Component
const DraggableCharacter: React.FC<{ character: Character }> = ({
  character,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CHARACTER,
    item: { characterId: character.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        margin: "4px",
        padding: "4px",
        border: "1px solid",
      }}
    >
      {character.name}
    </div>
  );
};

// Droppable Slot Component
const DroppableSlot: React.FC<{
  slot: SceneSlot;
  assignedCharacter: string | undefined;
  onAssignCharacter: (characterId: string) => void;
}> = ({ slot, assignedCharacter, onAssignCharacter }) => {
  const [{ dragging }, drop] = useDrop(() => ({
    accept: ItemTypes.CHARACTER,
    drop: (item: { characterId: string }) =>
      onAssignCharacter(item.characterId),
    collect: (monitor) => ({
      dragging: monitor.canDrop(),
    }),
  }));

  const character = assignedCharacter
    ? characters[assignedCharacter]
    : undefined;
  return (
    <div style={{ margin: "10px 0" }}>
      {slot.label}:{" "}
      <span
        ref={drop}
        style={{
          backgroundColor: dragging ? "lightblue" : "white",
          padding: "4px",
          border: `1px ${character ? "solid black" : "dashed gray"}`,
        }}
      >
        {assignedCharacter ? character?.name : "(nobody)"}
      </span>
    </div>
  );
};

// Droppable Insertion Point
const InsertionPoint: React.FC<{
  index: number;
}> = ({ index }) => {
  const dispatch = useDispatch();
  const handleInsertBeat = (index: number, templateId: string) => {
    dispatch(
      addStoryBeatToCurrentPuzzle({
        beat: {
          templateId,
          slotAssignedCharacters: {},
        },
        index: index,
      })
    );
  };
  const [{ dragging }, drop] = useDrop(() => ({
    accept: ItemTypes.SCENE,
    drop: (item: { templateId: string }) =>
      handleInsertBeat(index, item.templateId),
    collect: (monitor) => ({
      dragging: !!monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        height: "16px",
        backgroundColor: dragging ? "lightgreen" : "transparent",
        margin: "4px 0",
      }}
    />
  );
};

function StoryBeatView({
  beat,
  index,
  states,
}: {
  beat: StoryBeat;
  index: number;
  states: StoryState[];
}) {
  const template = sceneTemplates[beat.templateId];
  const dispatch = useDispatch();
  const handleRemoveBeat = () => {
    dispatch(removeStoryBeatFromCurrentPuzzle({ index: index }));
  };
  const handleAssignCharacter = (slotId: string, characterId: string) => {
    dispatch(
      setSlotCharacter({
        storyBeatIndex: index,
        slotId: slotId,
        characterId: characterId,
      })
    );
  };
  return (
    <span>
      <div
        key={index}
        style={{
          marginBottom: "8px",
          border: "1px solid black",
          padding: "8px",
        }}
      >
        <h3>{template?.name}</h3>
        {template?.slots.map((slot: SceneSlot) => (
          <DroppableSlot
            key={slot.id}
            slot={slot}
            assignedCharacter={beat.slotAssignedCharacters[slot.id]}
            onAssignCharacter={(characterId) =>
              handleAssignCharacter(slot.id, characterId)
            }
          />
        ))}
        <p>{states[index + 1]?.event || "\u00A0"}</p>
        <button onClick={() => handleRemoveBeat()}>Remove</button>
      </div>
      <InsertionPoint index={index + 1} />
    </span>
  );
}

function resolve<T extends Entity>(ids: string[], map: EntityMap<T>): T[] {
  return ids.map((id) => map[id]);
}

// Main App Component
function App() {
  const gameState = useSelector((state: RootState) => state.gameState);

  const puzzle = puzzles[gameState.currentPuzzleId];

  const puzzleState = gameState.puzzleStates[gameState.currentPuzzleId];
  const storyBeats = puzzleState.storyBeats;

  const states = getStates(storyBeats, puzzle.initialStoryState);

  const puzzleSceneTemplates = resolve(puzzle.sceneTemplates, sceneTemplates);
  const puzzleCharacters = resolve(puzzle.characters, characters);

  return (
    <DndProvider backend={HTML5Backend}>
      <h1>
        {puzzle.title}
        {puzzle.isWinning(states[states.length - 1]) && " - Victory"}
      </h1>
      <div style={{ display: "flex", gap: "12px" }}>
        <div>
          <div>
            <h2>Scenes:</h2>
            {puzzleSceneTemplates.map((template) => (
              <DraggableScene key={template.id} template={template} />
            ))}
          </div>

          <div>
            <h2>Characters:</h2>
            {puzzleCharacters.map((character) => (
              <DraggableCharacter key={character.id} character={character} />
            ))}
          </div>
        </div>

        <div>
          <h2>Story:</h2>
          <InsertionPoint index={0} />
          {storyBeats.map((beat, index) => {
            return (
              <StoryBeatView
                beat={beat}
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
}

export default App;
