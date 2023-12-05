import { expect, test } from 'vitest';
import { part1, part2 } from '../src/lib/2-rock-paper-scissors.js';

test('part1', () => {
  const output = part1(exampleInput);

  expect(output).toBe(15);
});

test('part2', () => {
  const output = part2(exampleInput);

  expect(output).toBe(12);
});

const exampleInput = `A Y
B X
C Z`;
