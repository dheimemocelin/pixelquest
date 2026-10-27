import { describe, expect, it } from "vitest";
import { levels } from "./levels";
import { execute, initialState, isVictory, step } from "./rules";
import { commandDirection, directionVector, facingRotation } from "./direction";
import type { Command } from "./types";

export const solutions: Command[][] = [
  ["right", "right"],
  ["right", "right", "up", "up", "right", "right"],
  ["up", "up", "right", "right", "right", "down", "down"],
];

describe("Hero rules", () => {
  it.each([
    ["up", 0, [0, -1], Math.PI],
    ["right", 1, [1, 0], -Math.PI / 2],
    ["down", 2, [0, 1], 0],
    ["left", 3, [-1, 0], Math.PI / 2],
  ] as const)("maps %s to the matching movement and facing", (command, direction, vector, rotation) => {
    expect(commandDirection[command]).toBe(direction);
    expect(directionVector[direction]).toEqual(vector);
    expect(facingRotation[direction]).toBe(rotation);
  });
  it.each([
    ["up", 2, 1],
    ["right", 3, 2],
    ["down", 2, 3],
    ["left", 1, 2],
  ] as const)("moves one cell %s and sets Nilo's facing", (command, x, y) => {
    const base = levels[0];
    const openLevel = {
      ...base,
      path: [
        { x: 2, y: 2 },
        { x: 2, y: 1 },
        { x: 3, y: 2 },
        { x: 2, y: 3 },
        { x: 1, y: 2 },
      ],
    };
    const result = step(openLevel, initialState(openLevel), command);
    expect(result.state).toMatchObject({ x, y, direction: commandDirection[command] });
  });
  it("blocks rocks and map edges", () => {
    const level = levels[0];
    const blocked = step(level, initialState(level), "up");
    expect(blocked.event).toBe("blocked");
    expect(blocked.state).toMatchObject({ x: 2, y: 2, direction: 0 });
    expect(step(level, { ...initialState(level), x: 0, y: 2 }, "left").event).toBe("blocked");
  });
  it.each(levels.map((level, i) => ({ level, solution: solutions[i] }))) (
    "solves stage $level.id",
    ({ level, solution }) => {
      const result = execute(level, solution);
      expect(result.at(-1)?.state.won).toBe(true);
      expect(result.at(-1)?.event).toBe("win");
    },
  );
  it("collects the key and rejects a shortcut to the treasure", () => {
    const result = execute(levels[2], ["up", "up"]);
    expect(result.at(-1)?.event).toBe("key");
    expect(result.at(-1)?.state.hasKey).toBe(true);
    expect(execute(levels[2], ["right", "right", "right"]).at(-1)?.event).toBe("locked");
  });
  it("requires reaching the treasure and a key when specified", () => {
    expect(isVictory(levels[2], { ...initialState(levels[2]), ...levels[2].treasure })).toBe(false);
    expect(execute(levels[0], ["right"]).at(-1)?.state.won).toBe(false);
  });
  it("stops a sequence at collision and victory", () => {
    expect(execute(levels[0], ["up", "right", "right"])).toHaveLength(1);
    expect(execute(levels[0], ["right", "right", "right"])).toHaveLength(2);
  });
  it("resets position, key, direction and victory for each attempt", () => {
    execute(levels[2], solutions[2]);
    expect(initialState(levels[2])).toEqual({ ...levels[2].start, hasKey: false, won: false });
    expect(execute(levels[2], ["up"])[0].state.hasKey).toBe(false);
  });
  it("handles an empty sequence without moving", () => {
    expect(execute(levels[0], [])).toEqual([]);
  });
});
