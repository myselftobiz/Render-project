// Timeline of the Ice Carrier short: timed to the voiceover (~83s = 2485 frames at 30fps)
// Story beats: Hook (0-6s), Sub threat (6-10s), Mid-Atlantic gap (10-15s), Insane idea (15-22s),
// Pykrete recipe (22-27s), Stronger/slower (27-31s), Named Pykrete (31-33s), Proposal 2000ft (33-36s),
// Conventional carriers (36-40s), Flammable pulp (40-45s), Thermal insulator (45-48s),
// Paper + frozen water (48-51s), Cool way to win (51-54s), extended ending to ~83s
export const FPS = 30;
export const TOTAL = 2485; // 82.83s * 30 = 2485 frames
export const D0 = 0.0; // Water level
export type V3 = [number, number, number];

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const smooth = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
export const easeOut = (u: number) => 1 - (1 - clamp01(u)) ** 4;

// ---------------- shots ----------------
export type Light = "day" | "golden";
export type Crowd = "none";
export type ShotDef = { id: number; a: number; b: number; light: Light; crowd: Crowd; tau: (t: number) => number };
export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: 180, light: "day", crowd: "none", tau: (t) => t },           // 0-6s: Hook - "What if I told you..."
  { id: 2, a: 180, b: 300, light: "day", crowd: "none", tau: (t) => t - 6 },      // 6-10s: Submarines sinking ships
  { id: 3, a: 300, b: 450, light: "day", crowd: "none", tau: (t) => t - 10 },     // 10-15s: Mid-Atlantic gap
  { id: 4, a: 450, b: 660, light: "day", crowd: "none", tau: (t) => t - 15 },     // 15-22s: Insane idea - floating airfield
  { id: 5, a: 660, b: 810, light: "day", crowd: "none", tau: (t) => t - 22 },     // 22-27s: Pykrete recipe - 14% wood pulp
  { id: 6, a: 810, b: 930, light: "golden", crowd: "none", tau: (t) => t - 27 },  // 27-31s: Stronger, melts slower
  { id: 7, a: 930, b: 990, light: "day", crowd: "none", tau: (t) => t - 31 },     // 31-33s: Named Pykrete
  { id: 8, a: 990, b: 1080, light: "day", crowd: "none", tau: (t) => t - 33 },    // 33-36s: Proposal - 2000ft carrier
  { id: 9, a: 1080, b: 1200, light: "day", crowd: "none", tau: (t) => t - 36 },   // 36-40s: Conventional carriers improved
  { id: 10, a: 1200, b: 1350, light: "day", crowd: "none", tau: (t) => t - 40 },  // 40-45s: Flammable wood pulp
  { id: 11, a: 1350, b: 1440, light: "golden", crowd: "none", tau: (t) => t - 45 }, // 45-48s: Thermal insulator
  { id: 12, a: 1440, b: 1530, light: "day", crowd: "none", tau: (t) => t - 48 },  // 48-51s: Paper and frozen water
  { id: 13, a: 1530, b: 1620, light: "day", crowd: "none", tau: (t) => t - 51 },  // 51-54s: Cool way to win a war
  { id: 14, a: 1620, b: TOTAL, light: "day", crowd: "none", tau: (t) => t - 54 }, // 54-83s: Extended ending / credits
];

export const XFADE: Record<number, number> = { 2: 8, 3: 8, 4: 8, 5: 8, 6: 8, 7: 8, 8: 8, 9: 8, 10: 8, 11: 8, 12: 8, 13: 8, 14: 8 };
export const FLASH_AT = 180; // White flash after hook

export const shotAt = (f: number) => SHOTS.find((s) => f >= s.a && f < s.b) ?? SHOTS[SHOTS.length - 1];

// Camera logic - using keyframe-based camera system like bridge
export type Cam = { pos: V3; look: V3; fov: number; roll: number };
export type CamKey = { f: number; dur?: number; cut?: boolean; s: (f: number) => Cam };

// Per-shot camera keyframes (t is shot-local time in seconds)
export const CAMS: Record<number, CamKey[]> = {
  1: [ // Hook: Wide establishing - icy ocean with carrier silhouette
    { f: 0, dur: 180, s: (f) => ({ pos: [0, 15, 40], look: [0, 0, 0], fov: 40, roll: 0 }) },
  ],
  2: [ // Sub threat: Underwater view, sub silhouette
    { f: 0, dur: 120, s: (f) => ({ pos: [10, -5, 20], look: [0, 0, 0], fov: 35, roll: 0 }) },
  ],
  3: [ // Mid-Atlantic gap: Wide map view
    { f: 0, dur: 150, s: (f) => ({ pos: [0, 50, 0], look: [0, 0, 0], fov: 50, roll: 0 }) },
  ],
  4: [ // Insane idea: Inventor close-up
    { f: 0, dur: 210, s: (f) => ({ pos: [2, 2, 5], look: [0, 1.5, 0], fov: 30, roll: 0 }) },
  ],
  5: [ // Pykrete recipe: Close on ice block with wood pulp
    { f: 0, dur: 150, s: (f) => ({ pos: [0, 1.5, 3], look: [0, 1, 0], fov: 25, roll: 0 }) },
  ],
  6: [ // Stronger/slower: Golden hour - ice block glowing
    { f: 0, dur: 120, s: (f) => ({ pos: [1, 1, 4], look: [0, 0.5, 0], fov: 28, roll: 0 }) },
  ],
  7: [ // Named Pykrete: Text card / name reveal
    { f: 0, dur: 60, s: (f) => ({ pos: [0, 2, 4], look: [0, 1.5, 0], fov: 35, roll: 0 }) },
  ],
  8: [ // Proposal: Wide - massive carrier scale
    { f: 0, dur: 90, s: (f) => ({ pos: [0, 20, 60], look: [0, 10, 0], fov: 40, roll: 0 }) },
  ],
  9: [ // Conventional carriers: Real carrier comparison
    { f: 0, dur: 120, s: (f) => ({ pos: [20, 10, 30], look: [0, 5, 0], fov: 35, roll: 0 }) },
  ],
  10: [ // Flammable: Close on paper/wood burning
    { f: 0, dur: 150, s: (f) => ({ pos: [0, 1, 3], look: [0, 0.5, 0], fov: 25, roll: 0 }) },
  ],
  11: [ // Thermal insulator: Golden - ice not melting
    { f: 0, dur: 90, s: (f) => ({ pos: [0, 2, 5], look: [0, 1, 0], fov: 30, roll: 0 }) },
  ],
  12: [ // Paper and frozen water: Pull back reveal
    { f: 0, dur: 90, s: (f) => ({ pos: [0, 5, 15], look: [0, 2, 0], fov: 40, roll: 0 }) },
  ],
  13: [ // Cool way to win: Final wide
    { f: 0, dur: 90, s: (f) => ({ pos: [0, 10, 40], look: [0, 0, 0], fov: 45, roll: 0 }) },
  ],
  14: [ // Extended ending: Slow pull out
    { f: 0, dur: TOTAL - 1620, s: (f) => ({ pos: [0, 15, 80], look: [0, 0, 0], fov: 50, roll: 0 }) },
  ],
};

// Impact kicks (flip-shakes on big moments)
export type Kick = { shot: number; f: number; axis: "x" | "y" | "z"; amp: number; decay: number };
export const KICKS: Kick[] = [
  { shot: 4, f: 210, axis: "z", amp: 0.08, decay: 7 }, // Insane idea punch
  { shot: 8, f: 90, axis: "y", amp: 0.1, decay: 7 },  // Massive carrier reveal
  { shot: 10, f: 50, axis: "x", amp: 0.06, decay: 7 }, // Flammable moment
];

// Depth of field per shot (cInf in pixels at 1080p)
export type DofDef = { cInf: number; focus?: (f: number) => V3 };
export const DOF: Record<number, DofDef> = {
  1: { cInf: 0 },      // Wide - sharp
  2: { cInf: 12 },     // Sub CU
  3: { cInf: 0 },      // Map wide
  4: { cInf: 14 },     // Inventor CU
  5: { cInf: 16 },     // Ice block extreme CU
  6: { cInf: 14 },     // Golden ice CU
  7: { cInf: 10 },     // Text card
  8: { cInf: 8 },      // Carrier wide but with some depth
  9: { cInf: 10 },     // Carrier comparison
  10: { cInf: 16 },    // Paper burning CU
  11: { cInf: 12 },    // Golden insulator
  12: { cInf: 10 },    // Reveal
  13: { cInf: 0 },     // Final wide sharp
  14: { cInf: 0 },     // Ending wide
};

export const dofAt = (f: number): DofDef => {
  const s = shotAt(f);
  const base = DOF[s.id] ?? { cInf: 0 };
  // Could add per-frame focus pulling here
  return base;
};

// Foreground framing props (near lens objects that frame the shot)
export type Foreground = { kit: string; pos: V3; yaw?: number; s?: number; a: number; b: number };
export const FOREGROUND: Foreground[] = [
  // Shot 1: Ice chunks framing the carrier
  { kit: "tree_cone", pos: [-6, 0.5, -5], s: 2, a: 0, b: 180 },
  { kit: "tree_cone", pos: [6, 0.5, -5], s: 1.5, a: 0, b: 180 },
];

// Layer crossfade helper
export const layersAt = (f: number) => {
  const s = shotAt(f);
  const base = { id: s.id, alpha: 1 };
  const xf = XFADE[s.id];
  if (xf && f < s.a + xf) {
    const alpha = smooth((f - s.a) / xf);
    const prev = SHOTS.find((sh) => sh.b === s.a);
    if (prev) return [{ id: prev.id, alpha: 1 - alpha }, base];
  }
  if (xf && f >= s.b - xf) {
    const alpha = 1 - smooth((f - (s.b - xf)) / xf);
    const next = SHOTS.find((sh) => sh.a === s.b);
    if (next) return [base, { id: next.id, alpha }];
  }
  return [base];
};

// Interpolate camera from CAMS keys
export const camAt = (id: number, frame: number): Cam => {
  const keys = CAMS[id];
  if (!keys) return { pos: [0, 10, 20], look: [0, 0, 0], fov: 40, roll: 0 };
  const shot = SHOTS.find((s) => s.id === id);
  if (!shot) return keys[0].s(0);
  const t = (frame - shot.a) / FPS;
  // Find the active key
  let acc = 0;
  for (const k of keys) {
    const dur = k.dur ?? 0;
    if (t < acc + dur) {
      const localF = (t - acc) * FPS;
      return k.s(localF);
    }
    acc += dur;
  }
  // Last key holds
  return keys[keys.length - 1].s((t - (acc - (keys[keys.length - 1].dur ?? 0))) * FPS);
};

// Bridge state compatibility (for world.ts)
export type BridgeState = { bounce: number; drop: number; snap: number };
export const bridgeState = (id: number, t: number): BridgeState => ({ bounce: 0, drop: 0, snap: 0 });
export const deckY = (z: number, b: BridgeState) => D0;
export const dropW = (z: number) => 0;
export const shapeZ = (z: number) => 1;
export const snapEnd = (snap: number) => [0, 0, 0] as V3;
export const front = (tau: number) => 0;
export const FOREGROUND_KEYS = FOREGROUND;
export const PARK = [0, 0, 0] as V3;
export const ANCHOR = [0, 0, 0] as V3;
export const SNAP = 0;
export const SU_SWING = 1;
export const V3_ZERO = [0, 0, 0] as V3;