import type { Activity } from "./types";

export function isCorrect(activity: Activity, answer: string[]): boolean {
  if (answer.length !== activity.correct.length) return false;
  if (activity.interaction === "multiple") {
    const selected = new Set(answer);
    return activity.correct.every((token) => selected.has(token));
  }
  return answer.every((token, index) => token === activity.correct[index]);
}

export function availableTokens(activity: Activity, needsSupport: boolean) {
  if (!needsSupport || !activity.supportTokens) return activity.tokens;
  const visible = new Set(activity.supportTokens);
  return activity.tokens.filter((token) => visible.has(token.id));
}

export function nextSupportMode(errors: number, hintsUsed: number): boolean {
  return errors > 0 || hintsUsed > 0;
}
