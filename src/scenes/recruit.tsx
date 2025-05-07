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
      state.say(proposer.id, `If you join the police, you will finally be free from your crimes!`);
      state.say(acceptor.id, `OK, I will do it.`);
      return;
    }
  },
};
