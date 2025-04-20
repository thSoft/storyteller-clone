import { RelationType, StoryGraph, StoryState } from "../storyState";
import { Character } from "../types";

export function areRelated(
  graph: StoryGraph,
  type: RelationType,
  characterId1: string,
  characterId2: string,
  directed: boolean = true
) {
  if (directed) {
    return graph.someDirectedEdge(
      characterId1,
      characterId2,
      (_, edgeAttributes) => edgeAttributes.type === type
    );
  } else {
    return graph.someUndirectedEdge(
      characterId1,
      characterId2,
      (_, edgeAttributes) => edgeAttributes.type === type
    );
  }
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
    (person) => state.graph.getNodeAttributes(person.id).dead === true,
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
    areRelated(state.graph, "loves", deadPerson.id, otherPerson.id) &&
    !state.graph.getNodeAttributes(otherPerson.id).dead &&
    !state.graph.getNodeAttributes(otherPerson.id).heartbroken
  ) {
    state.graph.setNodeAttribute(otherPerson.id, "heartbroken", true);
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

export function getRelated(
  graph: StoryGraph,
  type: RelationType,
  person: Character
): string | undefined {
  return graph
    .mapOutEdges(person.id, (_0, edgeAttributes, _1, target) =>
      edgeAttributes.type === type ? target : undefined
    )
    .filter((target) => target !== undefined)[0];
}
