import type { StatBlock } from "./statblock";

export type ImportedItem = {
  type: "statblock";
  data: StatBlock;
};
