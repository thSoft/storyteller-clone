import { StoryState } from "../storyState";
import { Character } from "../types";

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
  const [deadPerson, otherPerson] = getPerson(
    (person) => state.dead[person.id],
    person1,
    person2
  );
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

export function getPerson(
  predicate: (person: Character) => boolean,
  person1: Character | undefined,
  person2?: Character
): [Character | undefined, Character | undefined] {
  if (person1 && predicate(person1)) {
    return [person1, person2];
  } else if (person2 && predicate(person2)) {
    return [person2, person1];
  }
  return [undefined, undefined];
}
