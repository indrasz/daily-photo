/**
 * Lightweight class joiner — concatenates truthy class names.
 * (Avoids pulling in clsx/cn dependency.)
 */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Format seconds as mm:ss. */
export function fmtTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
