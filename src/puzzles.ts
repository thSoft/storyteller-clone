import { eveDiesHeartbroken } from "./puzzles/eveDiesHeartbroken";
import { entityMap } from "./utils";

export const puzzles = entityMap([eveDiesHeartbroken]);

export const chapters = [
  {
    title: "Broken Hearts Everywhere",
    puzzles: [eveDiesHeartbroken.id],
  },
];
