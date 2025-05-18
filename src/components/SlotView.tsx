import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { Tooltip } from "react-tooltip";
import { characters } from "../characters";
import { impersonate, impersonatedSlot, impersonatorSlot } from "../scenes/impersonate";
import { StateProxy } from "../stateProxy";
import { OtherAction, Speech, Thought } from "../storyState";
import { Panel, Scene, SceneSlot } from "../types";
import { CharacterView } from "./CharacterView";
import { ItemTypes } from "./ItemTypes";

export const SlotView: React.FC<{
  slot: SceneSlot;
  index: number;
  assignedCharacterId: string | undefined;
  onAssignCharacter: (characterId: string) => void;
  speech?: Speech;
  thought?: Thought;
  otherAction?: OtherAction;
  panelIndex: number;
  panel: Panel;
  stateBefore: StateProxy;
  scene: Scene;
}> = ({
  slot,
  index,
  assignedCharacterId,
  onAssignCharacter,
  speech,
  thought,
  otherAction,
  panelIndex,
  panel,
  stateBefore,
  scene,
}) => {
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

  const resolvedCharacter = assignedCharacterId
    ? characters[stateBefore.resolveImpersonation(assignedCharacterId)]
    : scene.id === impersonate.id && slot.id === impersonatedSlot.id
    ? characters[panel.slotAssignedCharacters[impersonatorSlot.id]]
    : undefined;

  const id = `${panelIndex}-${index}`;

  function getBubble(thought: boolean, message: string) {
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

  const wide = scene.slots.length < 2;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "end",
        backgroundColor: dragging && isOver ? "yellow" : dragging ? "lightgreen" : "transparent",
      }}
      ref={ref}
    >
      <div style={{ width: wide ? "12vw" : "6vw" }}>
        {thought && (
          <svg viewBox="0 0 100 100" style={{ width: "100%", height: wide ? "8vh" : "100%" }}>
            <ellipse cx="55" cy="97" rx="6" ry="3" fill="white" stroke="black" />
            <ellipse cx="60" cy="93" rx="8" ry="4" fill="white" stroke="black" />
          </svg>
        )}
      </div>
      {speech && getBubble(false, speech.message)}
      {thought && getBubble(true, thought.message)}
      <span
        style={{
          transform: scene.id !== impersonate.id && index % 2 === 1 ? "scaleX(-1)" : "none",
        }}
        data-tooltip-id={id}
      >
        <CharacterView character={resolvedCharacter} showName={false} action={otherAction?.action} wide={wide} />
      </span>
    </div>
  );
};
