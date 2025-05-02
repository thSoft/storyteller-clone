import { mafiaCharacters } from "../characters";
import { mafiaScenes } from "../scenes";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { vincenzoTakesOver } from "./vincenzoTakesOver";

export const framing: Puzzle = {
  id: "framing",
  title: "Framing",
  prompt: "Framing a Rival",
  scenes: mafiaScenes,
  characters: mafiaCharacters,
  isWinning: (state) => {
    const bankRobberId = state.getGlobalState("bankRobber")?.id;
    if (bankRobberId) {
      return (
        !state.getState(bankRobberId, "arrested") &&
        state.getCharacterIds((characterId, attributes) => characterId !== bankRobberId && attributes.arrested === true)
          .length > 0
      );
    }
    const murdererIds = state.getRelations("killed").map(({ source }) => source);
    return (
      murdererIds.every((id) => !state.getState(id, "arrested")) &&
      state.getCharacterIds(
        (characterId, attributes) => !murdererIds.includes(characterId) && attributes.arrested === true
      ).length > 0
    );
  },
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 5,
  dependsOn: vincenzoTakesOver.id,
};
