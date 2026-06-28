// OpenFray schema (subset) — the shapes this importer produces. Mirrors
// openfray/src/schema/{creature,action,primitives}.ts. Kept in sync by hand; only
// the fields the converter emits are included.

export type Ability = "str" | "dex" | "con" | "int" | "wis" | "cha";
export type AbilityScores = Record<Ability, number>;
export type SaveBonuses = Partial<Record<Ability, number>>;

export type Size =
  | "Tiny"
  | "Small"
  | "Medium or Small"
  | "Medium"
  | "Large"
  | "Huge"
  | "Gargantuan";

export type Skill =
  | "acrobatics"
  | "animalHandling"
  | "arcana"
  | "athletics"
  | "deception"
  | "history"
  | "insight"
  | "intimidation"
  | "investigation"
  | "medicine"
  | "nature"
  | "perception"
  | "performance"
  | "persuasion"
  | "religion"
  | "sleightOfHand"
  | "stealth"
  | "survival";

export type SkillBonuses = Partial<Record<Skill, number>>;

export type DamageType =
  | "acid"
  | "bludgeoning"
  | "cold"
  | "fire"
  | "force"
  | "lightning"
  | "necrotic"
  | "piercing"
  | "poison"
  | "psychic"
  | "radiant"
  | "slashing"
  | "thunder";

export interface Speeds {
  walk?: number;
  fly?: number;
  swim?: number;
  climb?: number;
  burrow?: number;
  hover?: boolean;
}

export interface Senses {
  passivePerception: number;
  darkvision?: number;
  blindsight?: number;
  tremorsense?: number;
  truesight?: number;
}

export type ContentSource = string;
export type Edition = "5.0" | "5.5";

export type ActionKind = "melee" | "ranged" | "save" | "utility";
export type SaveOutcome = "half" | "none" | "negates";

export interface SaveRequirement {
  ability: Ability;
  dc: number;
  onSave: SaveOutcome;
}

export interface DamageRoll {
  formula: string;
  type: DamageType;
}

export interface Range {
  normal: number;
  long?: number;
}

export type Recharge =
  | { type: "dice"; value: number }
  | { type: "perDay"; value: number }
  | { type: "perRound"; value: number };

export interface Action {
  id: string;
  name: string;
  kind: ActionKind;
  toHit: number | null;
  reach?: number;
  range?: Range;
  damage?: DamageRoll[];
  save?: SaveRequirement | null;
  recharge?: Recharge;
  legendaryCost?: number;
  text?: string;
}

export interface Trait {
  name: string;
  text: string;
}

export type SpellUsage =
  | { type: "atWill" }
  | { type: "perDay"; per: number }
  | { type: "slots"; level: number };

export type SpellLevel = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
export type SpellSlots = Partial<Record<SpellLevel, number>>;

export interface SpellRef {
  name: string;
  /** Compendium id, e.g. "srd-5.2:fireball" — resolves the hover card in OpenFray. */
  ref?: string;
}

export interface SpellGroup {
  usage: SpellUsage;
  spells: SpellRef[];
}

export interface Spellcasting {
  ability?: Ability;
  /** The caster's save DC (the spell never owns the DC). */
  saveDc?: number;
  toHit?: number;
  groups: SpellGroup[];
  /** Per-level slot maxes for the 2014 slot model. */
  slots?: SpellSlots;
  /** A trailing note from the stat block (e.g. "*casts these on itself before combat"). */
  note?: string;
}

export interface LegendaryActions {
  perRound: number;
  actions: Action[];
}

export interface Creature {
  id: string;
  source: ContentSource;
  edition?: Edition;
  name: string;
  size: Size;
  type: string;
  alignment?: string;
  /** Optional flavor/lore (markdown), display only. Absent for SRD. */
  description?: string;
  ac: number;
  maxHp: number;
  hpFormula?: string;
  initiative?: number;
  speed: Speeds;
  abilities: AbilityScores;
  saves?: SaveBonuses;
  skills?: SkillBonuses;
  senses: Senses;
  languages?: string[];
  resistances?: string[];
  immunities?: string[];
  vulnerabilities?: string[];
  conditionImmunities?: string[];
  cr?: number;
  xp?: number;
  traits?: Trait[];
  actions?: Action[];
  bonusActions?: Action[];
  reactions?: Action[];
  legendaryActions?: LegendaryActions;
  lairActions?: Action[];
  spellcasting?: Spellcasting;
  legendaryResistance?: number;
  legendaryResistanceLair?: number;
}
