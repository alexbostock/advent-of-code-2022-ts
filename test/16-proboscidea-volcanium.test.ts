import { expect, test } from 'vitest';
import {
  computeFlow,
  parseInput,
  part1,
  part2,
  type Graph,
} from '../src/lib/16-proboscidea-volcanium.js';

test('part1', () => expect(part1(exampleInput)).toBe(1651));

test.skip('part2', () => expect(part2(exampleInput)).toBe(1707));

test('parseInput', () => {
  const graph = parseInput(exampleSmallInput);

  const expected: Graph = {
    valveIds: ['BB', 'CC', 'DD'],
    valves: new Map([
      [
        'AA',
        {
          flowRate: 0,
          distances: new Map(),
        },
      ],
      [
        'BB',
        {
          flowRate: 3,
          distances: new Map(),
        },
      ],
      [
        'CC',
        {
          flowRate: 5,
          distances: new Map(),
        },
      ],
      [
        'DD',
        {
          flowRate: 4,
          distances: new Map(),
        },
      ],
    ]),
    valveData: new Map([
      ['AA', { flowRate: 0, neighbours: ['BB', 'CC'] }],
      ['BB', { flowRate: 3, neighbours: ['AA', 'CC', 'DD'] }],
      ['CC', { flowRate: 5, neighbours: ['AA', 'BB'] }],
      ['DD', { flowRate: 4, neighbours: ['BB'] }],
    ]),
  };

  expect(graph).toEqual(expected);
});

test('computeFlow', () => {
  const graph = parseInput(exampleInput);
  const valveOrder: string[] = ['DD', 'BB', 'JJ', 'HH', 'EE', 'CC'];
  expect(computeFlow(graph, valveOrder, 30)).toBe(1651);
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
Valve BB has flow rate=3; tunnels lead to valves AA, CC, DD
Valve CC has flow rate=5; tunnels lead to valves AA, BB
Valve DD has flow rate=4; tunnels lead to valves BB
`;
