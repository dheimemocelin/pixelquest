export type Command = 'forward' | 'left' | 'right';
export type Direction = 0 | 1 | 2 | 3; // north, east, south, west
export type Point = { x: number; y: number };
export type Level = { id: number; name: string; instruction: string; start: Point & { direction: Direction }; path: Point[]; treasure: Point; key?: Point; door?: Point; commands: Command[]; hints: string[]; maxCommands: number };
export type State = Point & { direction: Direction; hasKey: boolean; won: boolean };
export type Step = { state: State; event: 'move' | 'turn' | 'blocked' | 'locked' | 'key' | 'win' };
