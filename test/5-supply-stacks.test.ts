import { describe, expect, test } from 'vitest';
import {
  applyInstruction,
  applyInstruction9001,
  parseInstructions,
  parseStacks,
  part1,
  part2,
  type Instruction,
  type Stacks,
} from '../src/lib/5-supply-stacks.js';

test('part1', () => {
  expect(part1(exampleInput)).toBe('CMZ');
});

test('part2', () => {
  expect(part2(exampleInput)).toBe('MCD');
});

const exampleInput = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
`;

test('parseStacks', () => {
  const serialised = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 
`;

  const expected = new Map([
    ['1', ['Z', 'N']],
    ['2', ['M', 'C', 'D']],
    ['3', ['P']],
  ]);

  expect(parseStacks(serialised)).toEqual(expected);
});

test('parseInstructions', () => {
  const serialised = `move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
`;

  const expected: Instruction[] = [
    { number: 1, source: '2', destination: '1' },
    { number: 3, source: '1', destination: '3' },
    { number: 2, source: '2', destination: '1' },
    { number: 1, source: '1', destination: '2' },
  ];

  expect(parseInstructions(serialised)).toEqual(expected);
});

describe('applyInstruction', () => {
  const testCases: [[Stacks, Instruction], Stacks][] = [
    [
      [
        new Map([
          ['1', ['Z', 'N']],
          ['2', ['M', 'C', 'D']],
          ['3', ['P']],
        ]),
        {
          number: 1,
          source: '2',
          destination: '1',
        },
      ],
      new Map([
        ['1', ['Z', 'N', 'D']],
        ['2', ['M', 'C']],
        ['3', ['P']],
      ]),
    ],
    [
      [
        new Map([
          ['1', []],
          ['2', ['M', 'C']],
          ['3', ['P', 'D', 'N', 'Z']],
        ]),
        {
          number: 2,
          source: '2',
          destination: '1',
        },
      ],
      new Map([
        ['1', ['C', 'M']],
        ['2', []],
        ['3', ['P', 'D', 'N', 'Z']],
      ]),
    ],
  ];

  test.each(testCases)('%j', ([stacks, instruction], expected) => {
    applyInstruction(stacks, instruction);
    expect(stacks).toEqual(expected);
  });
});

test('applyInstruction9001', () => {
  const stacks: Stacks = new Map([
    ['1', ['A']],
    ['2', ['B', 'C']],
  ]);

  const instruction: Instruction = { number: 2, source: '2', destination: '1' };

  const expected: Stacks = new Map([
    ['1', ['A', 'B', 'C']],
    ['2', []],
  ]);

  applyInstruction9001(stacks, instruction);

  expect(stacks).toEqual(expected);
});
