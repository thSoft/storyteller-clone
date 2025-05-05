import { Scene } from "../types";

const proposerSlot = { id: "proposer", label: "Proposer" };
const acceptorSlot = { id: "acceptor", label: "Acceptor" };

export const recruit: Scene = {
  id: "recruit",
  name: "Recruit",
  slots: [proposerSlot, acceptorSlot],
  outcomeLogic: (state, assigned) => {
    const proposer = assigned[proposerSlot.id];
    const acceptor = assigned[acceptorSlot.id];
    if (state.getState(proposer.id, "worksForPolice")) {
      state.setState(acceptor.id, "worksForPolice", true);
      state.setDescription(`${proposer.name} persuaded ${acceptor.name} to join the police.`);
      return;
    }
  },
};
