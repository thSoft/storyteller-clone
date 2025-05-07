import { Scene } from "../types";

const firstSlot = { id: "first", label: "First" };
const secondSlot = { id: "second", label: "Second" };

export const placeholder: Scene = {
  id: "placeholder",
  name: "",
  slots: [firstSlot, secondSlot],
  outcomeLogic: () => {},
};
