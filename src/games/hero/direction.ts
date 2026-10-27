import type { Command, Direction } from "./types";

/** Grid coordinates use x to the right and y down; Nilo's base pose faces south. */
export const directionVector: Record<Direction, readonly [number, number]> = {
  0: [0, -1],
  1: [1, 0],
  2: [0, 1],
  3: [-1, 0],
};

export const commandDirection: Record<Command, Direction> = {
  up: 0,
  right: 1,
  down: 2,
  left: 3,
};

/** Phaser uses clockwise-positive rotation in screen coordinates. */
export const facingRotation: Record<Direction, number> = {
  0: Math.PI,
  1: -Math.PI / 2,
  2: 0,
  3: Math.PI / 2,
};
