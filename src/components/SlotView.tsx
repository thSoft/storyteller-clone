import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { Tooltip } from "react-tooltip";
import { characters } from "../characters";
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
}> = ({ index, assignedCharacter, onAssignCharacter, speech, thought, otherAction, panelIndex }) => {
  const [{ dragging, isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CHARACTER,
    drop: (item: { characterId: string }) => onAssignCharacter(item.characterId),
    collect: (monitor) => ({
      dragging: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
  }));

  const ref = useRef<HTMLSpanElement>(null);
  drop(ref);

  const character = assignedCharacter ? characters[assignedCharacter] : undefined;

  const id = `${panelIndex}-${index}`;

  function getSpeechBubble(thought: boolean, message: string) {
    return (
      <Tooltip
        content={message}
        id={id}
        isOpen={true}
        style={{
          width: "100px",
          backgroundColor: "white",
          color: "black",
          borderRadius: thought ? "40%" : "25%",
        }}
        noArrow={thought}
        border={"2px solid black"}
        opacity={1}
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          width: "140px",
          height: "120px",
        }}
      >
        {thought && (
          <svg viewBox="0 0 100 100">
            <ellipse cx="55" cy="82" rx="6" ry="3" fill="white" stroke="black" />
            <ellipse cx="60" cy="78" rx="8" ry="4" fill="white" stroke="black" />
          </svg>
        )}
      </div>
      {speech && getSpeechBubble(false, speech.message)}
      {thought && getSpeechBubble(true, thought.message)}
      <span
        ref={ref}
        style={{
          backgroundColor: isOver ? "yellow" : dragging ? "lightgreen" : "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: index % 2 === 1 ? "scaleX(-1)" : "none",
        }}
        data-tooltip-id={id}
      >
        <CharacterView character={character} showName={false} action={otherAction?.action} />
      </span>
    </div>
  );
};
