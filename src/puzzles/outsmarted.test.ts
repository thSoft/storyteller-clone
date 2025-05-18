import { bruno, donMarcello, donRomano, vincenzo } from "../characters";
import { impersonate } from "../scenes/impersonate";
import { orderHit } from "../scenes/orderHit";
import { showGun } from "../scenes/showGun";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { outsmarted } from "./outsmarted";

const validSolutions = [
  [
    panel(impersonate, bruno, vincenzo),
    panel(orderHit, donMarcello, bruno),
    panel(impersonate, bruno),
    panel(showGun, bruno, donMarcello),
  ],
];

const invalidSolutions: Panel[][] = [
  [panel(impersonate, bruno, vincenzo), panel(orderHit, donMarcello, bruno), panel(showGun, bruno, donMarcello)],
  [
    panel(impersonate, bruno, donRomano),
    panel(orderHit, donMarcello, bruno),
    panel(impersonate, bruno),
    panel(showGun, bruno, donMarcello),
  ],
];

runPuzzleTests(outsmarted, validSolutions, invalidSolutions);
