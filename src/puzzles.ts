import { eveDiesHeartbroken } from "./puzzles/eveDiesHeartbroken";
import { entityMap } from "./utils";

export const puzzles = entityMap([eveDiesHeartbroken]);

const chapter1 = {
  puzzles: [eveDiesHeartbroken.id],
};

export const chapters = [chapter1];
