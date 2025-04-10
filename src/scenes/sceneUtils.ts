import { grandma, hunter, red, wolf } from "../characters";
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
  if (options.checkKidnap) {
    const [kidnappedPerson] = getPerson(
      (person) => state.kidnapped === person.id,
      person1,
      person2
    );
    if (kidnappedPerson) {
      state.event = `${kidnappedPerson.name} was kidnapped.`;
      return true;
    }
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
  if (deadPerson && otherPerson && state.wolfLike[otherPerson.id]) {
    state.disappointed[otherPerson.id] = true;
    state.event += ` ${otherPerson.name} was disappointed that he/she couldn't eat ${deadPerson.name}.`;
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

export function handleLittleRedRidingHoodCharactersMeeting(
  state: StoryState,
  person1: Character,
  person2: Character,
  hunterInBed: boolean,
  wolfLikeInBed: boolean
) {
  if (
    ifCharactersAre(
      person1,
      person2,
      (theHunter, theWolfLike) =>
        theHunter.id === hunter.id && state.wolfLike[theWolfLike.id],
      (theHunter, theWolfLike) => {
        state.knowsAboutWolf[theHunter.id] = true;
        if (state.bullets[theHunter.id] === 0) {
          if (wolfLikeInBed) {
            state.event = `${hunter.name} tried to shoot ${theWolfLike.name}, but he didn't have any bullets. Fortunately ${theWolfLike.name} was sleeping.`;
          } else {
            state.dead[hunter.id] = true;
            state.event = `${hunter.name} tried to shoot ${theWolfLike.name}, but he didn't have any bullets. ${theWolfLike.name} ate him.`;
          }
        } else {
          state.bullets[theHunter.id]--;
          if (!hunterInBed && !wolfLikeInBed) {
            state.event = `${theHunter.name} nearly shot ${theWolfLike.name}, but it was quicker and he escaped. ${hunter.name} is now aware of ${theWolfLike.name}'s presence.`;
          } else {
            state.dead[theWolfLike.id] = true;
            if (wolfLikeInBed) {
              state.event = `${hunter.name} shot ${theWolfLike.name} while ${theWolfLike.name} was sleeping.`;
            } else {
              state.event = `${hunter.name} shot ${theWolfLike.name} because ${theWolfLike.name} didn't realize who is hiding under the blanket.`;
            }
          }
        }
      }
    )
  )
    return;

  const [werewolf, otherPerson] = getPerson(
    (person) => state.wolfLike[person.id],
    person1,
    person2
  );
  if (werewolf) {
    if (otherPerson) {
      if (state.wolfLike[otherPerson.id] || otherPerson.id === wolf.id) {
        state.event = `${person1.name} and ${person2.name} howled at each other heartily.`;
      } else {
        state.dead[otherPerson.id] = true;
        state.event = `${werewolf.name} met ${otherPerson?.name} and ate him/her.`;
      }
    }
  } else {
    if (
      ifCharactersAre(
        person1,
        person2,
        (a, b) => a.id === red.id && b.id === hunter.id,
        () => {
          if (state.knowsAboutWolf[hunter.id]) {
            state.knowsAboutWolf[red.id] = true;
            state.event = `${hunter.name} warned ${red.name} that ${wolf.name} is dangerous and she should not tell him where ${grandma.name} lives.`;
          } else {
            if (state.knowsAboutWolf[red.id]) {
              state.knowsAboutWolf[hunter.id] = true;
              state.event = `${red.name} told ${hunter.name} that she met the ${wolf.name} and told him where ${grandma.name} lives.`;
            } else {
              state.event = `${hunter.name} and ${red.name} greeted each other heartily.`;
            }
          }
        }
      )
    )
      return;
    state.event = `${person1.name} and ${person2.name} greeted each other heartily.`;
  }
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
