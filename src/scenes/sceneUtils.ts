import { Character, StoryState } from "../types";

function areRelated(
  relationshipMap: Record<string, string>,
  characterId1: string,
  characterId2: string
) {
  return (
    relationshipMap[characterId1] === characterId2 ||
    relationshipMap[characterId2] === characterId1
  );
}

export function handleDead(
  state: StoryState,
  person1: Character,
  person2?: Character
): boolean {
  const deadPerson =
    person1 && state.dead[person1.id]
      ? person1
      : person2 && state.dead[person2.id]
      ? person2
      : undefined;
  const otherPerson =
    deadPerson === person1
      ? person2
      : deadPerson === person2
      ? person1
      : undefined;
  if (deadPerson) {
    state.event = `${deadPerson.name} was dead.`;
  }
  if (
    deadPerson &&
    otherPerson &&
    areRelated(state.loves, deadPerson.id, otherPerson.id) &&
    !state.dead[otherPerson.id] &&
    !state.heartbroken[otherPerson.id]
  ) {
    state.heartbroken[otherPerson.id] = true;
    state.event += ` ${otherPerson.name} was heartbroken by the death of ${deadPerson.name}.`;
  }
  return deadPerson !== undefined;
}
