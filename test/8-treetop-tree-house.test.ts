import { describe, expect, test } from 'vitest';
import {
  numTreesVisible,
  part1,
  part2,
  scenicScore,
  treeVisible,
} from '../src/lib/8-treetrop-tree-house.js';

test('part1', () => {
  expect(part1(exampleInput)).toBe(21);
});

test('part2', () => {
  expect(part2(exampleInput)).toBe(8);
});

describe('treeVisible', () => {
  const testCases: [
    [rowNumber: number, columnNumber: number],
    visible: boolean,
  ][] = [
    [[1, 1], true],
    [[1, 2], true],
    [[1, 3], false],
    [[2, 1], true],
    [[2, 2], false],
    [[2, 3], true],
    [[3, 1], false],
    [[3, 2], true],
    [[3, 3], false],
  ];

  test.each(testCases)('%j', ([rowNumber, columnNumber], expected) => {
    expect(treeVisible(exampleTrees, rowNumber, columnNumber)).toBe(expected);
  });
});

describe('scenicScore', () => {
  const testCases: [
    [rowNumber: number, columnNumber: number],
    score: number,
  ][] = [
    [[1, 2], 4],
    [[3, 2], 8],
  ];

  test.each(testCases)('%j => %i', ([rowNumber, columnNumber], expected) => {
    expect(scenicScore(exampleTrees, rowNumber, columnNumber)).toBe(expected);
  });
});

describe('numTreesVisible', () => {
  const testCases: [trees: number[], numVisible: number][] = [
    [[3], 1],
    [[5, 2], 1],
    [[1, 2], 2],
    [[3, 5, 3], 2],
    [[3, 3], 2],
    [[4, 9], 2],
    [[5, 5, 7], 1],
    [[1, 1, 5], 3],
  ];

  test.each(testCases)('%j => %i', (trees, expected) => {
    expect(numTreesVisible(trees, 5)).toBe(expected);
  });

  test('edge case [3, 5, 6] (house height 3)', () => {
    expect(numTreesVisible([3, 5, 6], 3)).toBe(1);
  });

  test('edge case [2, 5, 6] (house height 3)', () => {
    expect(numTreesVisible([2, 5, 6], 3)).toBe(2);
  });

  test('edge case [3, 3, 6] (house height 3)', () => {
    expect(numTreesVisible([3, 3, 6], 3)).toBe(1);
  });

  test('edge case [2, 3, 6] (house height 3)', () => {
    expect(numTreesVisible([2, 3, 6], 3)).toBe(2);
  });
});

const exampleInput = `30373
25512
65332
33549
35390
`;

const exampleTrees = [
  [3, 0, 3, 7, 3],
  [2, 5, 5, 1, 2],
  [6, 5, 3, 3, 2],
  [3, 3, 5, 4, 9],
  [3, 5, 3, 9, 0],
];
