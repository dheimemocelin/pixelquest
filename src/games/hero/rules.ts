import type { Command, Level, Point, State, Step } from "./types";
import { commandDirection, directionVector } from "./direction";
export const same = (a: Point, b: Point) => a.x === b.x && a.y === b.y;
export const initialState = (level: Level): State => ({
  ...level.start,
  hasKey: false,
  won: false,
});
export const isVictory = (level: Level, state: State) =>
  same(state, level.treasure) && (!level.key || state.hasKey);
export function step(level: Level, state: State, command: Command): Step {
  if (state.won) return { state: { ...state }, event: "win" };
  const direction = commandDirection[command];
  const [dx, dy] = directionVector[direction];
  const next: State = {
    ...state,
    direction,
    x: state.x + dx,
    y: state.y + dy,
  };
  if (!level.path.some((p) => same(p, next)))
    return { state: { ...state, direction }, event: "blocked" };
  if (
    !state.hasKey &&
    ((level.door && same(next, level.door)) ||
      (level.key && same(next, level.treasure)))
  )
    return { state: { ...state, direction }, event: "locked" };
  const collected = !!level.key && same(next, level.key) && !state.hasKey;
  next.hasKey = state.hasKey || collected;
  next.won = isVictory(level, next);
  return { state: next, event: next.won ? "win" : collected ? "key" : "move" };
}
export function execute(level: Level, commands: Command[]): Step[] {
  let current = initialState(level);
  const result: Step[] = [];
  for (const command of commands) {
    const next = step(level, current, command);
    result.push(next);
    current = next.state;
    if (["win", "blocked", "locked"].includes(next.event)) break;
  }
  return result;
}
