import { describe, expect, test } from 'vitest';
import {
  computeRound,
  parseAllMonkeys,
  parseMonkeyDetails,
  part1,
  part2,
  part2InspectionNumbersForNumRounds,
  type Monkeys,
} from '../src/lib/11-monkey-in-the-middle.js';

test('part1', () => expect(part1(exampleInput)).toBe(10605));

test('part2', () => expect(part2(exampleInput)).toBe(2713310158));

describe('part2 examples', () => {
  const testCases: [numRounds: number, inspectionNumbers: number[]][] = [
    [1, [2, 4, 3, 6]],
    [20, [99, 97, 8, 103]],
    [1000, [5204, 4792, 199, 5192]],
    [2000, [10419, 9577, 392, 10391]],
    [3000, [15638, 14358, 587, 15593]],
    [4000, [20858, 19138, 780, 20797]],
    [5000, [26075, 23921, 974, 26000]],
    [6000, [31294, 28702, 1165, 31204]],
    [7000, [36508, 33488, 1360, 36400]],
    [8000, [41728, 38268, 1553, 41606]],
    [9000, [46945, 43051, 1746, 46807]],
    [10000, [52166, 47830, 1938, 52013]],
  ];

  test.each(testCases)('%i, %j', (numRounds, expected) =>
    expect(part2InspectionNumbersForNumRounds(exampleInput, numRounds)).toEqual(
      expected,
    ),
  );
});

describe('parseMonkeyDetails', () => {
  const testCases: [string, ReturnType<typeof parseMonkeyDetails>][] = [
    [
      `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3`,
      {
        monkeyId: 0,
        items: exampleInputParsed.get(0)!.items,
        rules: exampleInputParsed.get(0)!.rules,
      },
    ],
    [
      `Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0
`,
      {
        monkeyId: 1,
        items: exampleInputParsed.get(1)!.items,
        rules: exampleInputParsed.get(1)!.rules,
      },
    ],
    [
      `Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3`,
      {
        monkeyId: 2,
        items: exampleInputParsed.get(2)!.items,
        rules: exampleInputParsed.get(2)!.rules,
      },
    ],
  ];

  test.each(testCases)('%s', (serialised, expected) =>
    expect(parseMonkeyDetails(serialised)).toEqual(expected),
  );
});

test('parseAllMonkeys', () => {
  const monkeys = parseAllMonkeys(exampleInput);

  expect(monkeys).toEqual(exampleInputParsed);
});

test('computeRound', () => {
  const monkeys = parseAllMonkeys(exampleInput);
  computeRound(monkeys, true);

  const itemsByMonkey: [id: number, items: number[]][] = [
    ...monkeys.entries(),
  ].map(([id, { items }]) => [id, items]);

  const expected: [id: number, items: number[]][] = [
    [0, [20, 23, 27, 26]],
    [1, [2080, 25, 167, 207, 401, 1046]],
    [2, []],
    [3, []],
  ];

  expect(itemsByMonkey).toEqual(expected);
});

const exampleInput = `Monkey 0:
Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
`;

const exampleInputParsed: Monkeys = new Map([
  [
    0,
    {
      items: [79, 98],
      rules: {
        operation: {
          operation: '*',
          operand: 19,
        },
        test: { divisible: 23 },
        ifTest: 2,
        else: 3,
      },
      numInspections: 0,
    },
  ],
  [
    1,
    {
      items: [54, 65, 75, 74],
      rules: {
        operation: {
          operation: '+',
          operand: 6,
        },
        test: { divisible: 19 },
        ifTest: 2,
        else: 0,
      },
      numInspections: 0,
    },
  ],
  [
    2,
    {
      items: [79, 60, 97],
      rules: {
        operation: {
          operation: '*',
          operand: 'old',
        },
        test: { divisible: 13 },
        ifTest: 1,
        else: 3,
      },
      numInspections: 0,
    },
  ],
  [
    3,
    {
      items: [74],
      rules: {
        operation: {
          operation: '+',
          operand: 3,
        },
        test: { divisible: 17 },
        ifTest: 0,
        else: 1,
      },
      numInspections: 0,
    },
  ],
]);
