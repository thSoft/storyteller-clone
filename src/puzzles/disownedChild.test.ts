import { alessio, donMarcello, lucia } from "../characters";
import { disclose } from "../scenes/disclose";
import { disown } from "../scenes/disown";
import { eavesdrop } from "../scenes/eavesdrop";
import { fallInLove } from "../scenes/fallInLove";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { disownment } from "./disownedChild";

const validSolutions = [
  [panel(eavesdrop, donMarcello), panel(fallInLove, lucia, alessio), panel(disown, donMarcello, lucia)],
  [panel(eavesdrop, donMarcello), panel(fallInLove, alessio, lucia), panel(disown, donMarcello, lucia)],
  [panel(fallInLove, lucia, alessio), panel(disclose, lucia, donMarcello), panel(disown, donMarcello, lucia)],
  [panel(fallInLove, lucia, alessio), panel(disclose, alessio, donMarcello), panel(disown, donMarcello, lucia)],
];

const invalidSolutions: Panel[][] = [[]];

runPuzzleTests(disownment, validSolutions, invalidSolutions);
