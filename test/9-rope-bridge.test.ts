import { describe, expect, test } from 'vitest';
import {
  newTailPosition,
  nextLongRopeState,
  nextState,
  parseInstructions,
  part1,
  part2,
  type Coords,
  type Instruction,
  type LongRopeState,
  type RopeState,
} from '../src/lib/9-rope-bridge.js';

test('part1', () => expect(part1(exampleInput)).toBe(13));

test('part2', () => expect(part2(exampleInputPart2)).toBe(36));

test('parseInstructions', () => {
  const instructions = [...parseInstructions(exampleInput)];

  const expected: Instruction[] = [
    'R',
    'R',
    'R',
    'R',
    'U',
    'U',
    'U',
    'U',
    'L',
    'L',
    'L',
    'D',
    'R',
    'R',
    'R',
    'R',
    'D',
    'L',
    'L',
    'L',
    'L',
    'L',
    'R',
    'R',
  ];

  expect(instructions).toEqual(expected);
});

describe('nextState', () => {
  test('head and tail moving from same position', () => {
    const state = nextState(
      {
        head: { x: 0, y: 0 },
        tail: { x: 0, y: 0 },
      },
      'R',
    );

    const expected: RopeState = {
      head: { x: 1, y: 0 },
      tail: { x: 0, y: 0 },
    };

    expect(state).toEqual(expected);
  });

  test('head and tail moving to same position', () => {
    const state = nextState(
      {
        head: { x: 1, y: 0 },
        tail: { x: 0, y: 0 },
      },
      'L',
    );

    const expected: RopeState = {
      head: { x: 0, y: 0 },
      tail: { x: 0, y: 0 },
    };

    expect(state).toEqual(expected);
  });

  test('tail separated below head', () => {
    const state = nextState(
      {
        head: { x: 0, y: 1 },
        tail: { x: 0, y: 0 },
      },
      'U',
    );

    const expected: RopeState = {
      head: { x: 0, y: 2 },
      tail: { x: 0, y: 1 },
    };

    expect(state).toEqual(expected);
  });

  test('tail separated left of head', () => {
    const state = nextState(
      {
        head: { x: 3, y: 0 },
        tail: { x: 2, y: 0 },
      },
      'R',
    );

    const expected: RopeState = {
      head: { x: 4, y: 0 },
      tail: { x: 3, y: 0 },
    };

    expect(state).toEqual(expected);
  });

  test('tail separated diagonally from head (vertical)', () => {
    const state = nextState(
      {
        head: { x: 1, y: 1 },
        tail: { x: 0, y: 0 },
      },
      'U',
    );

    const expected: RopeState = {
      head: { x: 1, y: 2 },
      tail: { x: 1, y: 1 },
    };

    expect(state).toEqual(expected);
  });

  test('tail separated diagonally from head (horizontal)', () => {
    const state = nextState(
      {
        head: { x: -1, y: -1 },
        tail: { x: 0, y: 0 },
      },
      'L',
    );

    const expected: RopeState = {
      head: { x: -2, y: -1 },
      tail: { x: -1, y: -1 },
    };

    expect(state).toEqual(expected);
  });
});

describe('nextLongRopeState', () => {
  // ......
  // ......
  // ......
  // ....H.
  // 4321..  (4 covers 5, 6, 7, 8, 9, s)

  // ......
  // ......
  // ....H.
  // .4321.
  // 5.....  (5 covers 6, 7, 8, 9, s)
  test('tricky move after diagonal', () => {
    const state = nextLongRopeState(
      {
        knots: [
          { x: 4, y: 1 },
          { x: 3, y: 0 },
          { x: 2, y: 0 },
          { x: 1, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 0 },
        ],
      },
      'U',
    );

    const expected: LongRopeState = {
      knots: [
        { x: 4, y: 2 },
        { x: 4, y: 1 },
        { x: 3, y: 1 },
        { x: 2, y: 1 },
        { x: 1, y: 1 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ],
    };

    expect(state).toEqual(expected);
  });
});

describe('newTailPosition', () => {
  test('tail separated diagonally from head (difference two horizontally AND vertically)', () => {
    const state = newTailPosition({ x: -2, y: 2 }, { x: 0, y: 0 });

    const expected: Coords = { x: -1, y: 1 };

    expect(state).toEqual(expected);
  });

  test('awkward diagonal', () => {
    const state = newTailPosition({ x: 4, y: 2 }, { x: 3, y: 0 });

    const expected: Coords = { x: 4, y: 1 };

    expect(state).toEqual(expected);
  });
});

const exampleInput = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
`;

const exampleInputPart2 = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20
`;
