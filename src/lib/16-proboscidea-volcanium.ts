interface Valve {
  flowRate: number;
  neighbours: string[];
}
type Valves = Map<string, Valve>;

export interface Graph {
  valveIds: string[]; // where flowRate > 0, not including start
  valves: Map<
    string,
    {
      flowRate: number;
      distances: Map<string, number>; // other valve id -> distance
    }
  >;
  valveData: Valves;
}

export function part1(input: string): number {
  const graph = parseInput(input);

  let maxFlow = 0;
  for (const valveOrder of possibleValveOrders(graph.valveIds)) {
    const flow = computeFlow(graph, valveOrder, 30);
    maxFlow = Math.max(maxFlow, flow);
  }
  return maxFlow;
}

export function part2(input: string) {
  return 0;
}

export function parseInput(input: string): Graph {
  const lines = input.split('\n').filter(val => val !== '');
  const valves: Valves = new Map(lines.map(parseLine));

  const valvesToTraverse = [...valves.entries()].filter(
    ([id, { flowRate }]) => flowRate > 0 || id === 'AA',
  );
  const valvesWithNonZeroFlow = valvesToTraverse.filter(
    ([, { flowRate }]) => flowRate > 0,
  );

  return {
    valveIds: valvesWithNonZeroFlow.map(([id]) => id),
    valves: new Map(
      valvesToTraverse.map(([fromId, { flowRate }]) => [
        fromId,
        {
          flowRate,
          distances: new Map<string, number>(),
        },
      ]),
    ),
    valveData: valves,
  };
}

function parseLine(line: string): [id: string, Valve] {
  const [, id, , , rateSerialised, , , , , ...neighboursSerialised] =
    line.split(' ');
  const [, flowRate] = rateSerialised.split('=');
  const neighbours = neighboursSerialised.join(' ').split(', ');
  return [id, { flowRate: parseInt(flowRate), neighbours }];
}

function distance(valves: Valves, from: string, to: string) {
  const visitedIds = new Set<string>();
  const frontierQueue: { valveId: string; distance: number }[] = [
    { valveId: from, distance: 0 },
  ];
  while (frontierQueue.length > 0) {
    const { valveId, distance } = frontierQueue.shift()!;
    if (valveId === to) {
      return distance;
    }
    visitedIds.add(valveId);
    const valve = valves.get(valveId)!;
    for (const neighbour of valve.neighbours) {
      if (!visitedIds.has(neighbour)) {
        frontierQueue.push({ valveId: neighbour, distance: distance + 1 });
      }
    }
  }
  throw new Error('No path found');
}

function* possibleValveOrders(ids: string[]): Generator<string[]> {
  if (ids.length === 0) {
    yield [];
    return;
  }
  for (const id of ids) {
    const allOtherIds = ids.filter(otherId => otherId !== id);
    for (const subOrder of possibleValveOrders(allOtherIds)) {
      yield [id, ...subOrder];
    }
  }
}

// function * possibleDualValveOrders(ids: string[]): Generator<[string[], string[]]> {
//   for (const subset of possibleSubsets(ids)) {
//     const complement = ids.filter(id => !subset.includes(id));

//   }
// }

// function *possibleSubsets(ids: string[]): Generator<string[]> {
//   if (ids.length === 0) {
//     yield [];
//     return
//   }
//   const first = ids[0]
//   for (const subSubset of possibleSubsets(ids.slice(1))) {
//     yield [first, ...subSubset];
//     yield subSubset;
//   }
// }

export function computeFlow(
  graph: Graph,
  valveOrder: string[],
  numSteps: number,
): number {
  let cumulativeFlow = 0;
  let flowRate = 0;
  let stepNum = 0;

  let currentValveId = 'AA';
  for (const nextValveId of valveOrder) {
    const distance = loadDistance(
      graph,
      graph.valves.get(currentValveId)!.distances,
      currentValveId,
      nextValveId,
    );

    if (!distance) {
      throw new Error('Cannot find path between valves');
    }
    for (let i = 0; i < distance + 1; i++) {
      cumulativeFlow += flowRate;
      stepNum++;
    }
    const nextValve = graph.valves.get(nextValveId);
    if (!nextValve) {
      throw new Error('Cannot find next valve');
    }
    flowRate += nextValve.flowRate;

    currentValveId = nextValveId;
  }

  const stepsRemaining = numSteps - stepNum;
  cumulativeFlow += stepsRemaining * flowRate;

  return cumulativeFlow;
}

function loadDistance(
  graph: Graph,
  distances: Map<string, number>,
  fromId: string,
  toId: string,
) {
  const distanceCached = distances.get(toId);
  if (distanceCached) {
    return distanceCached;
  } else {
    const d = distance(graph.valveData, fromId, toId);
    distances.set(toId, d);
    return d;
  }
}
