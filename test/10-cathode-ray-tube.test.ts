import { describe, expect, test } from 'vitest';
import {
  applyInstruction,
  createEnvHistory,
  part1,
  type Environment,
} from '../src/lib/10-cathode-ray-tube.js';

test('part1', () => expect(part1(exampleInput)).toBe(13140));

test('createEnvHistory', () => {
  const envHistory = createEnvHistory(['noop', 'addx 3', 'addx -5']);

  const expected = [
    { x: 1 },
    { x: 1 },
    { x: 1 },
    { x: 4 },
    { x: 4 },
    { x: -1 },
  ];

  expect(envHistory).toEqual(expected);
  expect(envHistory[4]).toEqual({ x: 4 });
  expect(envHistory[5]).toEqual({ x: -1 });
});

describe('applyInstruction', () => {
  test('noop returns same env', () => {
    const env: Environment = {
      x: 7,
    };
    expect(applyInstruction(env, 'noop')).toEqual([env]);
  });

  test('addx does nothing for one tick, then adds to x', () => {
    const env: Environment = {
      x: 3,
    };

    const expected: Environment[] = [{ x: 3 }, { x: 1 }];

    expect(applyInstruction(env, 'addx -2')).toEqual(expected);
  });
});

const shortExampleInput = `noop
addx 3
addx -5
`;

const exampleInput = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop
`;
