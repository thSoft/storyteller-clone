import { characters } from "../characters";
import { RelationType } from "../storyState";
import { Scene } from "../types";
import { handleMurderDiscovery, handlePreconditions } from "./sceneUtils";
export const speakerSlot = { id: "speaker", label: "Speaker" };
export const listenerSlot = { id: "listener", label: "Listener" };
export const disclose: Scene = {
  id: "disclose",
  name: "👂 Disclose",
  slots: [speakerSlot, listenerSlot],
  outcomeLogic: (state, assigned) => {
    const speaker = assigned[speakerSlot.id];
    const listener = assigned[listenerSlot.id];
    if (handlePreconditions(state, speaker, listener)) return;
    const speakerPromisedMurderToListener = state.areRelated(speaker.id, "promisedMurderTo", listener.id);
    const victimIds = state.getRelated(speaker.id, "killed", speaker.id);
    const orderedVictimIds = victimIds.filter((victimId) => state.areRelated(listener.id, "wantsToKill", victimId));
    // If the speaker promised murder to the listener
    // and the speaker believes that he killed a person whom the listener actually wants to kill,
    // then the listener is glad to hear it and promotes the speaker
    if (speakerPromisedMurderToListener && orderedVictimIds.length > 0) {
      for (const victimId of orderedVictimIds) {
        state.setState(victimId, "dead", true, true);
        state.addRelation(speaker.id, "killed", victimId, true);
      }
      state.setState(listener.id, "content", true);
      state.setState(speaker.id, "promoted", true);
      state.setGlobalState(
        "event",
        `${speaker.name} told ${listener.name} that ${speaker.name} killed ${characters[orderedVictimIds[0]]?.name}. ${
          listener.name
        } was glad to hear it and promoted ${speaker.name}.`
      );
      return;
    }
    const gunOwnerIdAccordingToSpeaker = state.getGlobalState("gunOwner", speaker.id)?.id;
    // If the speaker promised murder to the listener and believes that a policeman owns the gun,
    // then the listener is angry at the speaker and fires him
    if (
      speakerPromisedMurderToListener &&
      gunOwnerIdAccordingToSpeaker !== undefined &&
      state.getState(gunOwnerIdAccordingToSpeaker, "worksForPolice")
    ) {
      state.addRelation(listener.id, "angryAt", speaker.id);
      state.setState(speaker.id, "fired", true);
      state.setGlobalState(
        "event",
        `${speaker.name} told ${listener.name} that ${characters[gunOwnerIdAccordingToSpeaker]?.name} has the gun. ${listener.name} was angry to hear it and fired ${speaker.name}.`
      );
      return;
    }
    const bankRobberId = state.getGlobalState("bankRobber")?.id;
    // If the speaker promised heist to the listener and robbed the bank,
    // then the listener is glad to hear it and rewards the speaker
    if (state.areRelated(speaker.id, "promisedHeistTo", listener.id) && bankRobberId === speaker.id) {
      state.setGlobalState("bankRobber", speaker, true);
      state.setState(listener.id, "content", true);
      state.setState(speaker.id, "rewarded", true);
      state.setGlobalState(
        "event",
        `${speaker.name} told ${listener.name} that he robbed the bank. ${listener.name} was glad to hear it and rewarded ${speaker.name}.`
      );
      return;
    }
    // If the speaker promised heist to the listener and someone else robbed the bank,
    // then the listener is angry at the speaker and fires him
    if (state.areRelated(speaker.id, "promisedHeistTo", listener.id) && bankRobberId !== speaker.id) {
      state.addRelation(listener.id, "angryAt", speaker.id);
      state.setState(speaker.id, "fired", true);
      state.setGlobalState(
        "event",
        `${speaker.name} told ${listener.name} that someone else robbed the bank. ${listener.name} was angry to hear it and fired ${speaker.name}.`
      );
      return;
    }
    // If the speaker is aware of a hit or heist plan where the speaker is not involved in the crime,
    // then (s)he tells the listener about it
    const speakerIsNotInvolved = ({ source, target }: { source: string; target: string }): boolean =>
      source !== speaker.id && target !== speaker.id;
    const hitPlanners = state.getRelations("promisedMurderTo", speaker.id);
    const hitPlansToGiveAway = hitPlanners
      .filter(speakerIsNotInvolved)
      .map((sourceTarget) => ({ ...sourceTarget, crimeName: "hit", relationType: "promisedMurderTo" as RelationType }));
    const heistPlanners = state.getRelations("promisedHeistTo", speaker.id);
    const heistPlansToGiveAway = heistPlanners.filter(speakerIsNotInvolved).map((sourceTarget) => ({
      ...sourceTarget,
      crimeName: "heist",
      relationType: "promisedHeistTo" as RelationType,
    }));
    const crimePlansToGiveAway = [...hitPlansToGiveAway, ...heistPlansToGiveAway];
    if (crimePlansToGiveAway.length > 0) {
      for (const crimePlan of crimePlansToGiveAway) {
        state.addRelation(crimePlan.source, crimePlan.relationType, crimePlan.target, true);
      }
      state.setGlobalState(
        "event",
        `${speaker.name} told ${listener.name} that ${crimePlansToGiveAway
          .map(
            ({ crimeName: type, source, target }) =>
              ` ${characters[source]?.name} promised ${type} to ${characters[target]?.name}`
          )
          .join(" and ")}.`
      );
      return;
    }
    // If the speaker is aware of a performed hit where the speaker is not involved in the crime,
    // then (s)he tells the listener about it
    const hits = state.getRelations("killed", speaker.id);
    const hitsToGiveAway = hits.filter(speakerIsNotInvolved);
    if (hitsToGiveAway.length > 0) {
      for (const hit of hitsToGiveAway) {
        state.addRelation(hit.source, "killed", hit.target, true);
      }
      state.setGlobalState(
        "event",
        `${speaker.name} told ${listener.name} that ${hitsToGiveAway
          .map(({ source, target }) => ` ${characters[source]?.name} killed ${characters[target]?.name}`)
          .join(" and ")}.`
      );
      // Handle murder discovery for each hit
      for (const hit of hitsToGiveAway) {
        const murderer = characters[hit.source];
        const victim = characters[hit.target];
        if (murderer && victim) {
          handleMurderDiscovery(state, listener, murderer, victim);
        }
      }

      return;
    }
    // If the speaker is in love with someone, then (s)he tells the listener about it
    const lovedBySpeakerIds = state.getRelated(speaker.id, "loves", speaker.id);
    if (lovedBySpeakerIds.length > 0) {
      for (const lovedBySpeakerId of lovedBySpeakerIds) {
        state.addRelation(speaker.id, "loves", lovedBySpeakerId, true);
      }
      state.setGlobalState(
        "event",
        `${speaker.name} told ${listener.name} that he loves ${lovedBySpeakerIds
          .map((id) => characters[id]?.name)
          .join(", ")}.`
      );
      return;
    }
    // Otherwise
    state.setGlobalState("event", `${speaker.name} had nothing to tell to ${listener.name}.`);
  },
};
