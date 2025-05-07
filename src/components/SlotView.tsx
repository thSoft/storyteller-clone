import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { Tooltip } from "react-tooltip";
import { characters } from "../characters";
import { StateProxy } from "../stateProxy";
import { OtherAction, Speech, Thought } from "../storyState";
import { SceneSlot } from "../types";
import { CharacterView } from "./CharacterView";
import { ItemTypes } from "./ItemTypes";

export const SlotView: React.FC<{
  slot: SceneSlot;
  index: number;
  assignedCharacter: string | undefined;
  onAssignCharacter: (characterId: string) => void;
  speech?: Speech;
  thought?: Thought;
  otherAction?: OtherAction;
  panelIndex: number;
  state: StateProxy;
}> = ({ index, assignedCharacter, onAssignCharacter, speech, thought, otherAction, panelIndex, state }) => {
  const [{ dragging, isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CHARACTER,
    drop: (item: { characterId: string }) => onAssignCharacter(item.characterId),
    collect: (monitor) => ({
      dragging: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
  }));

  const ref = useRef<HTMLDivElement>(null);
  drop(ref);

  const character = assignedCharacter ? characters[state.resolveImpersonation(assignedCharacter)] : undefined;

  const id = `${panelIndex}-${index}`;

  function getSpeechBubble(thought: boolean, message: string) {
    return (
      <Tooltip
        content={message}
        id={id}
        isOpen={true}
        style={{
          width: "5vw",
          backgroundColor: "white",
          color: "black",
          borderRadius: thought ? "35%" : "25%",
        }}
        noArrow={thought}
        border={"2px solid black"}
        opacity={1}
      />
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: dragging && isOver ? "yellow" : dragging ? "lightgreen" : "white",
      }}
      ref={ref}
    >
      <div
        style={{
          width: "6vw",
          height: "14vh",
        }}
      >
        {thought && (
          <svg viewBox="0 0 100 100" style={{ width: "100%", height: "140%" }}>
            <ellipse cx="55" cy="82" rx="6" ry="3" fill="white" stroke="black" />
            <ellipse cx="60" cy="78" rx="8" ry="4" fill="white" stroke="black" />
          </svg>
        )}
      </div>
      {speech && getSpeechBubble(false, speech.message)}
      {thought && getSpeechBubble(true, thought.message)}
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: assignedCharacter !== undefined && index % 2 === 1 ? "scaleX(-1)" : "none",
        }}
        data-tooltip-id={id}
      >
        <CharacterView character={character} showName={false} action={otherAction?.action} />
      </span>
    </div>
  );
};
