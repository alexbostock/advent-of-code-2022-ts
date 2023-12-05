import { describe, expect, test } from 'vitest';
import {
  findBadge,
  overlappingItem,
  part1,
  part2,
} from '../src/lib/3-rucksack-reorganisation.js';

test('part1', () => {
  expect(part1(exampleInput)).toBe(157);
});

test('part2', () => {
  expect(part2(exampleInput)).toBe(70);
});

describe('overlappingItem', () => {
  const testCases: [string, string][] = [
    ['vJrwpWtwJgWrhcsFMMfFFhFp', 'p'],
    ['jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL', 'L'],
  ];

  test.each(testCases)('%s => %s', (item, expected) => {
    expect(overlappingItem(item)).toBe(expected);
  });
});

describe('findBadge', () => {
  const testCases: [string, string][] = [
    [
      `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg`,
      'r',
    ],
    [
      `wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`,
      'Z',
    ],
  ];

  test.each(testCases)('%s => %s', (rucksacks, expected) => {
    expect(findBadge(rucksacks)).toBe(expected);
  });
});

const exampleInput = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
`;
