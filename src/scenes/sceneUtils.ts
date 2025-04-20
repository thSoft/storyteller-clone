import { StoryState } from "../storyState";
import { Character } from "../types";

export function areRelated(
  relationshipMap: Record<string, string>,
  characterId1: string,
  characterId2: string
) {
  return (
    relationshipMap[characterId1] === characterId2 ||
    relationshipMap[characterId2] === characterId1
  );
}

export function handlePreconditions(
  state: StoryState,
  person1: Character,
  person2?: Character,
  options: { checkDeathWitnessing?: boolean; checkKidnap?: boolean } = {
    checkDeathWitnessing: true,
    checkKidnap: true,
  }
): boolean {
  const [deadPerson, otherPerson] = getPerson(
    (person) => state.dead[person.id],
    person1,
    person2
  );
  if (deadPerson) {
    state.event = `${deadPerson.name} was dead.`;
    if (options.checkDeathWitnessing) {
      handleDeathWitnessing(state, deadPerson, otherPerson);
    }
    return true;
  }
  return false;
}

export function handleDeathWitnessing(
  state: StoryState,
  deadPerson: Character | undefined,
  otherPerson: Character | undefined
) {
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
}

export function getPerson(
  predicate: (person: Character, otherPerson: Character | undefined) => boolean,
  person1: Character | undefined,
  person2?: Character
): [Character | undefined, Character | undefined] {
  if (person1 && predicate(person1, person2)) {
    return [person1, person2];
  } else if (person2 && predicate(person2, person1)) {
    return [person2, person1];
  }
  return [undefined, undefined];
}

export function ifCharactersAre(
  person1: Character,
  person2: Character,
  predicate: (person: Character, otherPerson: Character) => boolean,
  callback: (firstCharacter: Character, secondCharacter: Character) => void
): boolean {
  if (predicate(person1, person2)) {
    callback(person1, person2);
    return true;
  } else if (predicate(person2, person1)) {
    callback(person2, person1);
    return true;
  }
  return false;
}

export function getRelated(
  relationshipMap: Record<string, string>,
  person: Character
) {
  const loveOfPersonId = relationshipMap[person.id];
  if (loveOfPersonId !== undefined) return loveOfPersonId;
  return Object.entries(relationshipMap).find(
    ([_, loved]) => loved === person.id
  )?.[0];
}
