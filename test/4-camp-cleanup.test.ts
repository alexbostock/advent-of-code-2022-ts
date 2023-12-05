import { describe, expect, test } from 'vitest';
import {
  RangeInclusive,
  parseRanges,
  part1,
  part2,
  rangeFullyContains,
  rangesOverlap,
} from '../src/lib/4-camp-cleanup.js';

test('part1', () => {
  expect(part1(exampleInput)).toBe(2);
});

test('part2', () => {
  expect(part2(exampleInput)).toBe(4);
});

describe('parseRanges', () => {
  const testCases: [string, [RangeInclusive, RangeInclusive]][] = [
    [
      '2-4,6-8',
      [
        { start: 2, end: 4 },
        { start: 6, end: 8 },
      ],
    ],
    [
      '6-6,4-6',
      [
        { start: 6, end: 6 },
        { start: 4, end: 6 },
      ],
    ],
  ];

  test.each(testCases)('%s', (serialised, expected) => {
    expect(parseRanges(serialised)).toEqual(expected);
  });
});

describe('rangeFullyContains', () => {
  const testCases: [[RangeInclusive, RangeInclusive], boolean][] = [
    [
      [
        { start: 6, end: 6 },
        { start: 4, end: 6 },
      ],
      false,
    ],
    [
      [
        { start: 4, end: 6 },
        { start: 6, end: 6 },
      ],
      true,
    ],
    [
      [
        { start: 1, end: 3 },
        { start: 3, end: 4 },
      ],
      false,
    ],
    [
      [
        { start: 2, end: 3 },
        { start: 7, end: 9 },
      ],
      false,
    ],
  ];

  test.each(testCases)('%j => %s', ([range, otherRange], expected) => {
    expect(rangeFullyContains(range, otherRange)).toBe(expected);
  });
});

describe('rangesOverlap', () => {
  const testCases: [[RangeInclusive, RangeInclusive], boolean][] = [
    [
      [
        { start: 2, end: 4 },
        { start: 6, end: 8 },
      ],
      false,
    ],
    [
      [
        { start: 2, end: 3 },
        { start: 4, end: 5 },
      ],
      false,
    ],
    [
      [
        { start: 5, end: 7 },
        { start: 7, end: 9 },
      ],
      true,
    ],
    [
      [
        { start: 2, end: 8 },
        { start: 3, end: 7 },
      ],
      true,
    ],
    [
      [
        { start: 6, end: 6 },
        {
          start: 4,
          end: 6,
        },
      ],
      true,
    ],
    [
      [
        { start: 2, end: 6 },
        { start: 4, end: 8 },
      ],
      true,
    ],
  ];

  test.each(testCases)('%j => %s', ([range1, range2], expected) => {
    expect(rangesOverlap(range1, range2)).toBe(expected);
  });
});

const exampleInput = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;
