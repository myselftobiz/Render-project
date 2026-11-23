import { Pen, Outfit, townsfolk, bodySide, soldier } from "./toon";
import { TOTAL } from "./story";

// Character configurations for the Ice Carrier story
export const INVENTOR: Outfit = { jacket: "#5a3b2a", pants: "#3b3f52", boots: "#2a1f1a", hat: "tophat", skin: "#ecd0b6", build: "stout" };
export const SAILOR: Outfit = { jacket: "#3b5b9a", pants: "#3d4440", boots: "#2a1f1a", hat: "cap", cap: "#f1f1f1", skin: "#f5c9a0", build: "adult" };
export const OFFICER: Outfit = { jacket: "#1a2b4a", pants: "#1a2b4a", boots: "#2a1f1a", hat: "cap", cap: "#c00", skin: "#f5c9a0", build: "adult" };

export const cast = {
  inventor: INVENTOR,
  sailor1: soldier(1),
  sailor2: soldier(2),
  officer: OFFICER,
};

// Roles aligned with the 14 shots in story.ts
export const roles: Record<number, { character: keyof typeof cast; pose: (f: number) => any }[]> = {
  1: [{ character: "inventor", pose: (f) => ({ mode: "stand", expr: "neutral" }) }],                    // Hook: Inventor presenting
  2: [{ character: "sailor1", pose: (f) => ({ mode: "stand", expr: "worried" }) }],                    // Sub threat: Sailor spotting sub
  3: [{ character: "officer", pose: (f) => ({ mode: "stand", expr: "serious" }) }],                    // Mid-Atlantic: Officer looking at map
  4: [{ character: "inventor", pose: (f) => ({ mode: "push", expr: "grin", pose: Math.sin(f * 0.1) }) }], // Insane idea: Inventor explaining
  5: [{ character: "inventor", pose: (f) => ({ mode: "stand", expr: "neutral" }) }],                   // Pykrete recipe: Inventor showing block
  6: [{ character: "inventor", pose: (f) => ({ mode: "stand", expr: "smile" }) }],                     // Stronger/slower: Golden glow
  7: [{ character: "inventor", pose: (f) => ({ mode: "stand", expr: "proud" }) }],                     // Named Pykrete: Name reveal
  8: [{ character: "inventor", pose: (f) => ({ mode: "push", expr: "grin", pose: Math.sin(f * 0.05) }) }], // Proposal: Grand gesture
  9: [{ character: "officer", pose: (f) => ({ mode: "stand", expr: "relief" }) }],                     // Conventional carriers: Officer relieved
  10: [{ character: "inventor", pose: (f) => ({ mode: "stand", expr: "worried" }) }],                  // Flammable: Inventor concerned
  11: [{ character: "inventor", pose: (f) => ({ mode: "stand", expr: "smile" }) }],                    // Thermal insulator: Inventor reassuring
  12: [{ character: "inventor", pose: (f) => ({ mode: "stand", expr: "neutral" }) }],                  // Paper and frozen water: Matter of fact
  13: [{ character: "inventor", pose: (f) => ({ mode: "stand", expr: "smile" }) },
       { character: "sailor1", pose: (f) => ({ mode: "stand", expr: "relief" }) }],                    // Cool way to win: Happy ending
  14: [{ character: "sailor1", pose: (f) => ({ mode: "march", expr: "neutral" }) },
       { character: "sailor2", pose: (f) => ({ mode: "march", expr: "neutral" }) }],                   // Extended ending: Sailors on carrier
};