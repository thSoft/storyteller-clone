import { alessio, donMarcello, inspectorRinaldi, lucia, nico, vincenzo } from "../characters";
import { arrest } from "../scenes/arrest";
import { die } from "../scenes/die";
import { disclose } from "../scenes/disclose";
import { disown } from "../scenes/disown";
import { eavesdrop } from "../scenes/eavesdrop";
import { orderHit } from "../scenes/orderHit";
import { recruit } from "../scenes/recruit";
import { shoot } from "../scenes/shoot";
import { takeOver } from "../scenes/takeover";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { luciaTakesOver } from "./luciaTakesOver";

const validSolutions = [
  [
    panel(eavesdrop, donMarcello),
    panel(recruit, inspectorRinaldi, nico),
    panel(disown, donMarcello, nico),
    panel(orderHit, donMarcello, vincenzo),
    panel(eavesdrop, nico),
    panel(shoot, vincenzo, alessio),
    panel(disclose, nico, inspectorRinaldi),
    panel(arrest, inspectorRinaldi, vincenzo),
    panel(die, donMarcello),
    panel(takeOver, lucia),
  ],
];

const invalidSolutions: Panel[][] = [[panel(die, donMarcello), panel(takeOver, vincenzo)]];

runPuzzleTests(luciaTakesOver, validSolutions, invalidSolutions);
