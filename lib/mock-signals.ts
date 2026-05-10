// Deterministic mock signal generators for processing/analytic screens.
// Pure JS — no randomness on render so SSR and CSR agree.

export type Pt = { x: number; y: number };

/** Cumulative sway path length over time t∈[0,duration]. */
export function splSeries(duration = 30, scale = 28): Pt[] {
  const pts: Pt[] = [];
  const N = 120;
  for (let i = 0; i < N; i++) {
    const t = (i / (N - 1)) * duration;
    // Slightly noisy monotonic growth.
    const v = (t / duration) * scale + Math.sin(t * 0.9) * 0.4;
    pts.push({ x: round2(t + 0.1), y: round2(Math.max(0, v)) });
  }
  return pts;
}

/** Velocity-like noisy series. */
export function velocitySeries(
  duration = 30,
  base = 0.6,
  amp = 0.25,
  seed = 1
): Pt[] {
  const pts: Pt[] = [];
  const N = 200;
  for (let i = 0; i < N; i++) {
    const t = (i / (N - 1)) * duration + 1;
    const v =
      base +
      amp * Math.sin(t * 1.7 + seed) +
      amp * 0.6 * Math.sin(t * 4.3 + seed * 2) +
      amp * 0.3 * Math.sin(t * 9.1);
    pts.push({ x: round2(t), y: round3(Math.max(0, v)) });
  }
  return pts;
}

/** CoP scatter — elliptical cloud. */
export function copScatter(n = 280, rx = 0.55, ry = 0.55, seed = 1): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + seed;
    const r = 0.85 + 0.1 * Math.sin(a * 6 + seed);
    pts.push({
      x: round3(Math.cos(a) * rx * r + 0.05),
      y: round3(Math.sin(a) * ry * r + 0.05),
    });
  }
  return pts;
}

/** Tight CoP cloud (early phase). */
export function copCloudTight(n = 50, seed = 1): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + seed;
    pts.push({
      x: round3(0.2 + Math.cos(a) * 0.04),
      y: round3(0.05 + Math.sin(a) * 0.05),
    });
  }
  return pts;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
function round3(n: number) {
  return Math.round(n * 1000) / 1000;
}
