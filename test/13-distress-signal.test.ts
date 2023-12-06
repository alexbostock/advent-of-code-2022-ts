import { describe, expect, test } from 'vitest';
import {
  correctOrder,
  part1,
  part2,
  type Packet,
} from '../src/lib/13-distress-signal.js';

test('part1', () => expect(part1(exampleInput)).toBe(13));

test('part2', () => expect(part2(exampleInput)).toBe(140));

describe('correctOrder', () => {
  const testCases: [[Packet, Packet], boolean][] = [
    [
      [
        [1, 1, 3, 1, 1],
        [1, 1, 5, 1, 1],
      ],
      true,
    ],
    [
      [
        [[1], [2, 3, 4]],
        [[1], 4],
      ],
      true,
    ],
    [[[9], [[8, 7, 6]]], false],
    [
      [
        [[4, 4], 4, 4],
        [[4, 4], 4, 4, 4],
      ],
      true,
    ],
    [
      [
        [7, 7, 7, 7],
        [7, 7, 7],
      ],
      false,
    ],
    [[[], [3]], true],
    [[[[[]]], [[]]], false],
    [
      [
        [1, [2, [3, [4, [5, 6, 7]]]], 8, 9],
        [1, [2, [3, [4, [5, 6, 0]]]], 8, 9],
      ],
      false,
    ],
  ];

  test.each(testCases)('%j => %s', ([left, right], expected) =>
    expect(correctOrder(left, right)).toBe(expected),
  );
});

const exampleInput = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]
`;
