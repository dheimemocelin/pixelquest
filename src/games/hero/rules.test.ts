import { describe, expect, it } from 'vitest';
import { levels } from './levels';
import { execute, initialState, isVictory, step } from './rules';
import type { Command } from './types';
export const solutions:Command[][]=[['forward','forward'],['forward','forward','left','forward','forward','right','forward','forward'],['forward','forward','right','forward','forward','forward','right','forward','forward']];
describe('Hero rules',()=>{
  it('moves one cell in the facing direction without mutating input',()=>{const state=initialState(levels[0]);expect(step(levels[0],state,'forward').state).toMatchObject({x:3,y:2,direction:1});expect(state.x).toBe(2);});
  it('turns without moving and wraps all directions',()=>{let s=initialState(levels[0]);for(let i=0;i<4;i++)s=step(levels[0],s,'left').state;expect(s).toEqual(initialState(levels[0]));expect(step(levels[0],s,'right').state).toMatchObject({x:2,y:2,direction:2});});
  it('blocks rocks and map edges',()=>{const s=initialState(levels[0]);const blocked=step(levels[0],{...s,direction:0},'forward');expect(blocked.event).toBe('blocked');expect(blocked.state).toMatchObject({x:2,y:2});expect(step(levels[0],{...s,x:0,direction:3},'forward').event).toBe('blocked');});
  it.each(levels.map((level,i)=>({level,solution:solutions[i]})))('solves stage $level.id',({level,solution})=>{const result=execute(level,solution);expect(result.at(-1)?.state.won).toBe(true);expect(result.at(-1)?.event).toBe('win');});
  it('collects the key only once',()=>{const result=execute(levels[2],['forward','forward']);expect(result.at(-1)?.event).toBe('key');expect(result.at(-1)?.state.hasKey).toBe(true);});
  it('locks both the door and a shortcut to the treasure without key',()=>{const l=levels[2];expect(step(l,{x:4,y:1,direction:2,hasKey:false,won:false},'forward').event).toBe('locked');expect(execute(l,['right','forward','forward','forward']).at(-1)?.event).toBe('locked');});
  it('opens the door with the key',()=>{expect(step(levels[2],{x:4,y:1,direction:2,hasKey:true,won:false},'forward').event).toBe('move');});
  it('requires reaching the treasure, and a key when specified',()=>{expect(isVictory(levels[2],{...initialState(levels[2]),...levels[2].treasure})).toBe(false);expect(execute(levels[0],['forward']).at(-1)?.state.won).toBe(false);});
  it('stops a sequence at a collision and victory',()=>{expect(execute(levels[0],['left','forward','right','forward'])).toHaveLength(2);expect(execute(levels[0],['forward','forward','forward'])).toHaveLength(2);});
  it('resets position, key, orientation and victory for each attempt',()=>{execute(levels[2],solutions[2]);expect(initialState(levels[2])).toEqual({...levels[2].start,hasKey:false,won:false});expect(execute(levels[2],['forward'])[0].state.hasKey).toBe(false);});
  it('handles an empty sequence without moving',()=>{expect(execute(levels[0],[])).toEqual([]);});
});
