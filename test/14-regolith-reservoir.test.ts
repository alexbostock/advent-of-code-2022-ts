import { expect, test } from 'vitest';
import { Cave, part1, part2 } from '../src/lib/14-regolith-reservoir.js';

test('part1', () => expect(part1(exampleInput)).toBe(24));

test('part2', () => expect(part2(exampleInput)).toBe(93));

test('Cave constructor', () => {
  const cave = new Cave(exampleInput);
  expect(cave.rockPositions).toEqual(
    new Set([
      '498:4',
      '498:5',
      '498:6',
      '497:6',
      '496:6',
      '503:4',
      '502:4',
      '502:5',
      '502:6',
      '502:7',
      '502:8',
      '502:9',
      '501:9',
      '500:9',
      '499:9',
      '498:9',
      '497:9',
      '496:9',
      '495:9',
      '494:9',
    ]),
  );
  expect(cave.sandPositions).toEqual(new Set());
  expect(cave.abyssFloorY).toBe(11);
});

test('Cave.positionOccupied', () => {
  const cave = new Cave(exampleInput);
  expect(cave.positionOccupied(498, 4)).toBe(true);
  expect(cave.positionOccupied(11, 12)).toBe(false);
});

test('Cave.dropSand', () => {
  const cave = new Cave(exampleInput);

  expect(cave.positionOccupied(500, 8)).toBe(false);
  expect(cave.dropSand(500, 0)).toBe(false);
  expect(cave.sandPositions.size).toBe(1);
  expect(cave.positionOccupied(500, 8)).toBe(true);
  expect(cave.dropSand(600, 0)).toBe(true);
  expect(cave.sandPositions.size).toBe(1);
});

const exampleInput = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9
`;
