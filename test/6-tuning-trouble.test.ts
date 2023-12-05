import { describe, expect, test } from 'vitest';
import { part1, part2 } from '../src/lib/6-tuning-trouble.js';

describe('part1', () => {
  const testCases: [string, number][] = [
    ['mjqjpqmgbljsphdztnvjfqwrcgsmlb', 7],
    ['bvwbjplbgvbhsrlpgdmjqwftvncz', 5],
    ['nppdvjthqldpwncqszvftbrmjlhg', 6],
    ['nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', 10],
    ['zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 11],
  ];

  test.each(testCases)('%s => %i', (input, expected) => {
    expect(part1(input)).toBe(expected);
  });
});

describe('part2', () => {
  const testCases: [string, number][] = [
    ['mjqjpqmgbljsphdztnvjfqwrcgsmlb', 19],
    ['bvwbjplbgvbhsrlpgdmjqwftvncz', 23],
    ['nppdvjthqldpwncqszvftbrmjlhg', 23],
    ['nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', 29],
    ['zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 26],
  ];

  test.each(testCases)('%s => %i', (input, expected) => {
    expect(part2(input)).toBe(expected);
  });
});
