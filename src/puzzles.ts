import { eveDiesHeartbroken } from "./puzzles/eveDiesHeartbroken";
import { Chapter, EntityMap } from "./types";
import { entityMap } from "./utils";

export const puzzles = entityMap([eveDiesHeartbroken]);

export const chapters: EntityMap<Chapter> = entityMap([
  {
    id: "Broken Hearts Everywhere",
    title: "Broken Hearts Everywhere",
    puzzles: [eveDiesHeartbroken.id],
  },
]);
