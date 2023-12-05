import { expect, test } from 'vitest';
import {
  part1,
  part2,
  sumCaloriesInList,
} from '../src/lib/1-calorie-counting.js';

test('part1', () => {
  const output = part1(exampleInput);

  expect(output).toBe(24000);
});

test('part2', () => {
  const output = part2(exampleInput);

  expect(output).toBe(45000);
});

test('parseCaloriesList', () => {
  const input = `1000
2000
`;

  const output = sumCaloriesInList(input);

  expect(output).toBe(3000);
});

const exampleInput = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000
`;
