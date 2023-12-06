import { expect, test } from 'vitest';
import { part1, part2 } from '../src/lib/12-hill-climbing-algorithm.js';

test('part1', () => expect(part1(exampleInput)).toBe(31));

test('part2', () => expect(part2(exampleInput)).toBe(29));

const exampleInput = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
`;
