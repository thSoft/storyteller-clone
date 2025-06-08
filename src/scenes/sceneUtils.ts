import { StateProxy } from "../stateProxy";
import { Character } from "../types";

// Helper functions

export function getCharacter(
  predicate: (character: Character, otherCharacter: Character | undefined) => boolean,
  character1: Character | undefined,
  character2?: Character
): [Character | undefined, Character | undefined] {
  if (character1 && predicate(character1, character2)) {
    return [character1, character2];
  } else if (character2 && predicate(character2, character1)) {
    return [character2, character1];
  }
  return [undefined, undefined];
}

// Common scene logic

function handleEncounter(state: StateProxy, confronter: Character, confronted: Character): boolean {
  // If confronted is aware of confronter being dead, but the confronter is alive,
  // then the confronted is shocked by seeing the confronter alive
  if (!state.getState(confronter.id, "dead") && state.getState(confronter.id, "dead", confronted.id) === true) {
    state.setState(confronted.id, "shockedByAlive", true);
    state.think(confronted.id, `😲!!!`);
    state.setDescription(`${confronted.name} was shocked to see ${confronter.name} alive.`);
    return true;
  }
  return false;
}

export function handlePreconditions(state: StateProxy, character1: Character, character2?: Character): boolean {
  // Dead
  const [deadCharacter, otherCharacter] = getCharacter(
    (character) => state.getState(character.id, "dead") === true,
    character1,
    character2
  );
  if (deadCharacter) {
    state.setDescription(`${deadCharacter.name} was dead.`);
    handleDeathWitnessing(state, deadCharacter, otherCharacter);
    return true;
  }
  // Arrested
  if (state.getState(character1.id, "arrested")) {
    state.think(character1.id, `I am arrested.`);
    state.setDescription(`${character1.name} was arrested.`);
    return true;
  }
  if (character2 && state.getState(character2.id, "arrested")) {
    state.think(character2.id, `I am arrested.`);
    state.setDescription(`${character2.name} was arrested.`);
    return true;
  }
  // Other
  if (
    character2 &&
    (handleEncounter(state, character1, character2) || handleEncounter(state, character2, character1))
  ) {
    return true;
  }
  return false;
}

export function handleDeathWitnessing(
  state: StateProxy,
  deadCharacter: Character | undefined,
  otherCharacter: Character | undefined
) {
  if (
    deadCharacter &&
    otherCharacter &&
    state.areRelated(deadCharacter.id, "loves", otherCharacter.id) &&
    !state.getState(otherCharacter.id, "dead") &&
    !state.getState(otherCharacter.id, "heartbroken")
  ) {
    state.setState(otherCharacter.id, "heartbroken", true);
    const currentEvent = state.getGlobalState("event") || "";
    state.setDescription(
      `${currentEvent} ${otherCharacter.name} was heartbroken by the death of ${deadCharacter.name}.`
    );
  }
}

export function handleMurderDiscovery(
  state: StateProxy,
  discoverer: Character,
  murderer: Character,
  victim: Character
) {
  // If the victim is a child or employee of the discoverer, they want to kill the murderer
  if (state.areRelated(victim.id, "childOf", discoverer.id)) {
    state.addRelation(discoverer.id, "wantsToKill", murderer.id);
    const currentEvent = state.getGlobalState("event")?.description || "";
    state.setDescription(
      ` ${currentEvent} ${discoverer.name} wants to kill ${murderer.name} because they murdered ${victim.name}.`
    );
  }
}
export function canShowPoliceBadge(state: StateProxy, confronter: Character, confronted: Character) {
  return (
    state.getState(confronter.id, "worksForPolice", confronted.id) || state.getState(confronter.id, "worksForPolice")
  );
}
