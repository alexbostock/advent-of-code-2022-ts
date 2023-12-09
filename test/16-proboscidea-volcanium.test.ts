import { describe, expect, test } from 'vitest';
import {
  parseInput,
  part1,
  part2,
  possibleActions,
  possiblePaths,
  type Action,
  type ActionOrDontCare,
} from '../src/lib/16-proboscidea-volcanium.js';

test('part1', () => expect(part1(exampleInput)).toBe(1651));

test('part2', () => expect(part2(exampleInput)).toBe(1707));

test('parseInput', () => {
  const { startValve, totalNumValves, allNonZeroFlowRatesSorted } =
    parseInput(exampleInput);

  expect(
    startValve.neighbours.map(valve => [valve.id, valve.flowRate]),
  ).toEqual([
    ['DD', 20],
    ['II', 0],
    ['BB', 13],
  ]);

  expect(totalNumValves).toBe(6); // Does not count zero flow valves

  expect(allNonZeroFlowRatesSorted).toEqual([2, 3, 13, 20, 21, 22]);
});

describe('possibleActions', () => {
  test('lists possible actions', () => {
    const { startValve } = parseInput(exampleInput);
    const valve = startValve.neighbours[0];
    const actions = possibleActions(valve, new Set(), [3, 5], new Set());

    const expected: Action[] = [
      { type: 'OPEN', valve: valve },
      { type: 'TRAVEL_TO', valve: valve.neighbours[0] },
      { type: 'TRAVEL_TO', valve: valve.neighbours[1] },
      { type: 'TRAVEL_TO', valve: valve.neighbours[2] },
    ];

    expect(actions).toEqual(expected);
  });

  test('does not allow opening an already-open valve', () => {
    const { startValve } = parseInput(exampleInput);
    const valve = startValve.neighbours[0];
    const actions = possibleActions(valve, new Set([valve]), [5], new Set());

    const expected: Action[] = [
      { type: 'TRAVEL_TO', valve: valve.neighbours[0] },
      { type: 'TRAVEL_TO', valve: valve.neighbours[1] },
      { type: 'TRAVEL_TO', valve: valve.neighbours[2] },
    ];

    expect(actions).toEqual(expected);
  });

  test('does not allow immediately returning to previous valve', () => {
    const { startValve: valve } = parseInput(exampleInput);
    const actions = possibleActions(
      valve,
      new Set(),
      [3, 5],
      new Set([valve.neighbours[0]]),
    );

    const expected: Action[] = [
      { type: 'TRAVEL_TO', valve: valve.neighbours[1] },
      { type: 'TRAVEL_TO', valve: valve.neighbours[2] },
    ];

    expect(actions).toEqual(expected);
  });

  test('does not allow opening a valve with flow rate 0', () => {
    const { startValve: valve } = parseInput(exampleInput);
    const actions = possibleActions(valve, new Set(), [3, 5], new Set());

    const expected: Action[] = [
      { type: 'TRAVEL_TO', valve: valve.neighbours[0] },
      { type: 'TRAVEL_TO', valve: valve.neighbours[1] },
      { type: 'TRAVEL_TO', valve: valve.neighbours[2] },
    ];

    expect(actions).toEqual(expected);
  });

  test('always opens a valve which has the biggest flow rate among unopened valves', () => {
    const { startValve: aa } = parseInput(exampleSmallInput);
    const cc = aa.neighbours[1];
    const actions = possibleActions(cc, new Set(), [3, 5], new Set());

    const expected: Action[] = [{ type: 'OPEN', valve: cc }];

    expect(actions).toEqual(expected);
  });
});

describe('possiblePaths', () => {
  test('3 step example', () => {
    const { startValve: aa } = parseInput(exampleSmallInput);
    const bb = aa.neighbours[0];
    const cc = aa.neighbours[1];

    const paths = [...possiblePaths(aa, 3, 3, new Set(), [3, 5])];

    const expected: Action[][] = [
      [
        { type: 'TRAVEL_TO', valve: bb },
        { type: 'OPEN', valve: bb },
        { type: 'TRAVEL_TO', valve: aa },
      ],
      [
        { type: 'TRAVEL_TO', valve: bb },
        { type: 'OPEN', valve: bb },
        { type: 'TRAVEL_TO', valve: cc },
      ],
      [
        { type: 'TRAVEL_TO', valve: bb },
        { type: 'TRAVEL_TO', valve: cc },
        { type: 'OPEN', valve: cc },
      ],
      [
        { type: 'TRAVEL_TO', valve: cc },
        { type: 'OPEN', valve: cc },
        { type: 'TRAVEL_TO', valve: aa },
      ],
      [
        { type: 'TRAVEL_TO', valve: cc },
        { type: 'OPEN', valve: cc },
        { type: 'TRAVEL_TO', valve: bb },
      ],
    ];

    expect(paths).toEqual(expected);
  });

  test("don't care about steps after all valves are open", () => {
    const { startValve: aa } = parseInput(exampleSmallInput);
    const bb = aa.neighbours[0];
    const cc = aa.neighbours[1];

    const paths = [...possiblePaths(aa, 3, 3, new Set([aa, bb, cc]), [])];

    const expected: ActionOrDontCare[][] = [
      [{ type: 'DONT_CARE' }, { type: 'DONT_CARE' }, { type: 'DONT_CARE' }],
    ];

    expect(paths).toEqual(expected);
  });
});

const exampleInput = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II
`;

const exampleSmallInput = `Valve AA has flow rate=0; tunnels lead to valves BB, CC
Valve BB has flow rate=3; tunnels lead to valves AA, CC
Valve CC has flow rate=5; tunnels lead to valves AA, BB
`;
