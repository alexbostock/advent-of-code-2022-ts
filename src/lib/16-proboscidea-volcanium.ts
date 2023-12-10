interface ValveDetails {
  flowRate: number;
  neighbours: string[];
}

export interface Valve {
  id: string;
  flowRate: number;
  neighbours: Valve[];
}

export type Action =
  | {
      type: 'TRAVEL_TO';
      valve: Valve;
    }
  | {
      type: 'OPEN';
      valve: Valve;
    };

export type ActionOrDontCare =
  | Action
  | {
      type: 'DONT_CARE';
    };

export function part1(input: string): number {
  const { startValve, totalNumValves, allNonZeroFlowRatesSorted } =
    parseInput(input);

  let maxFlow = 0;
  for (const candidatePath of possiblePaths(
    startValve,
    totalNumValves,
    30,
    new Set(),
    allNonZeroFlowRatesSorted,
  )) {
    const flow = totalFlowForPath(candidatePath);
    maxFlow = Math.max(maxFlow, flow);
  }
  return maxFlow;
}

export function part2(input: string) {
  const { startValve, totalNumValves, allNonZeroFlowRatesSorted } =
    parseInput(input);

  let maxFlow = 0;
  for (const candidatePath of possibleDualPaths(
    startValve,
    startValve,
    totalNumValves,
    26,
    new Set(),
    allNonZeroFlowRatesSorted,
    new Set(),
    new Set(),
  )) {
    const flow = totalFlowForDualPath(candidatePath);
    maxFlow = Math.max(maxFlow, flow);
  }
  return maxFlow;
}

export function parseInput(input: string): {
  startValve: Valve;
  totalNumValves: number;
  allNonZeroFlowRatesSorted: number[];
} {
  const valveDetailsById: Map<string, ValveDetails> = new Map(
    input
      .split('\n')
      .filter(val => val !== '')
      .map(serialised => {
        const [, id, , , rateSerialised, , , , , ...neighboursSerialised] =
          serialised.split(' ');
        const rate = parseInt(rateSerialised.slice(5, -1));
        const neighbours = neighboursSerialised.join(' ').split(', ');
        return [
          id,
          {
            flowRate: rate,
            neighbours,
          },
        ];
      }),
  );

  const valvesById: Map<string, Valve> = new Map();
  for (const [id, valveDetails] of valveDetailsById.entries()) {
    valvesById.set(id, {
      id,
      flowRate: valveDetails.flowRate,
      neighbours: [],
    });
  }
  for (const [id, valve] of valvesById.entries()) {
    const valveDetails = valveDetailsById.get(id);
    if (!valveDetails) {
      throw new Error('Failed to fetch valve details');
    }
    valve.neighbours = valveDetails.neighbours.map(id => {
      const neighbourValve = valvesById.get(id);
      if (!neighbourValve) {
        throw new Error('Failed to fetch neighbour valve');
      }
      return neighbourValve;
    });
  }

  const startingValve = valvesById.get('AA');
  if (!startingValve) {
    throw new Error('Cannot find starting valve');
  }
  return {
    startValve: startingValve,
    totalNumValves: [...valvesById.values()].filter(valve => valve.flowRate > 0)
      .length,
    allNonZeroFlowRatesSorted: [...valvesById.values()]
      .map(({ flowRate }) => flowRate)
      .filter(flowRate => flowRate > 0)
      .sort((a, b) => a - b),
  };
}

export function possibleActions(
  currentValve: Valve,
  openValves: Set<Valve>,
  unopenedValveFlowRatesSorted: number[],
  valvesVisitedSinceLastOpen: Set<Valve>,
): Action[] {
  const maxmimumUnopenedFlowRate = unopenedValveFlowRatesSorted.at(-1);
  const mustOpenCurrentValve =
    maxmimumUnopenedFlowRate &&
    !openValves.has(currentValve) &&
    currentValve.flowRate === maxmimumUnopenedFlowRate;
  if (mustOpenCurrentValve) {
    return [{ type: 'OPEN', valve: currentValve }];
  }

  const actions: Action[] =
    openValves.has(currentValve) || currentValve.flowRate === 0
      ? []
      : [{ type: 'OPEN', valve: currentValve }];

  actions.push(
    ...currentValve.neighbours
      .filter(neighbour => !valvesVisitedSinceLastOpen.has(neighbour))
      .map(valve => {
        const action: Action = {
          type: 'TRAVEL_TO',
          valve,
        };
        return action;
      }),
  );
  return actions;
}

export function* possibleDualPaths(
  currentValve1: Valve,
  currentValve2: Valve,
  totalNumValves: number,
  numSteps: number,
  openValves: Set<Valve> = new Set(),
  unopenedValveFlowRatesSorted: number[],
  valvesVisitedSinceLastOpen1: Set<Valve>,
  valvesVisitedSinceLastOpen2: Set<Valve>,
): Generator<[ActionOrDontCare, ActionOrDontCare][]> {
  if (numSteps === 0) {
    yield [];
    return;
  }
  if (openValves.size === totalNumValves) {
    yield new Array<[ActionOrDontCare, ActionOrDontCare]>(numSteps).fill([
      { type: 'DONT_CARE' },
      { type: 'DONT_CARE' },
    ]);
    return;
  }

  for (const action1 of possibleActions(
    currentValve1,
    openValves,
    unopenedValveFlowRatesSorted,
    valvesVisitedSinceLastOpen1,
  )) {
    const openValvesWithAction1 =
      action1.type === 'OPEN'
        ? new Set([...openValves, action1.valve])
        : openValves;
    const unopenedFlowRatesWithAction1 =
      action1.type === 'OPEN'
        ? dropOpenedValveFromFlowRates(
            unopenedValveFlowRatesSorted,
            action1.valve,
          )
        : unopenedValveFlowRatesSorted;

    for (const action2 of possibleActions(
      currentValve2,
      openValvesWithAction1,
      unopenedFlowRatesWithAction1,
      valvesVisitedSinceLastOpen2,
    )) {
      const openValvesAfterActions =
        action2.type === 'OPEN'
          ? new Set([...openValvesWithAction1, action2.valve])
          : openValvesWithAction1;
      const unopenedFlowRatesAfterActions =
        action2.type === 'OPEN'
          ? dropOpenedValveFromFlowRates(
              unopenedFlowRatesWithAction1,
              action2.valve,
            )
          : unopenedFlowRatesWithAction1;

      const possibleFuturePaths = possibleDualPaths(
        action1.type === 'TRAVEL_TO' ? action1.valve : currentValve1,
        action2.type === 'TRAVEL_TO' ? action2.valve : currentValve2,
        totalNumValves,
        numSteps - 1,
        openValvesAfterActions,
        unopenedFlowRatesAfterActions,
        action1.type === 'TRAVEL_TO'
          ? new Set([...valvesVisitedSinceLastOpen1, currentValve1])
          : new Set(),
        action2.type === 'TRAVEL_TO'
          ? new Set([...valvesVisitedSinceLastOpen2, currentValve2])
          : new Set(),
      );

      for (const possibleFuturePath of possibleFuturePaths) {
        yield [[action1, action2], ...possibleFuturePath];
      }
    }
  }
}

export function* possiblePaths(
  currentValve: Valve,
  totalNumValves: number,
  numSteps: number,
  openValves: Set<Valve> = new Set(),
  unopenedValveFlowRatesSorted: number[],
  valvesVisitedSinceLastOpen: Set<Valve> = new Set(),
): Generator<ActionOrDontCare[]> {
  if (numSteps === 0) {
    yield [];
    return;
  }
  if (openValves.size === totalNumValves) {
    yield new Array<ActionOrDontCare>(numSteps).fill({ type: 'DONT_CARE' });
    return;
  }

  for (const action of possibleActions(
    currentValve,
    openValves,
    unopenedValveFlowRatesSorted,
    valvesVisitedSinceLastOpen,
  )) {
    const possibleFuturePaths =
      action.type === 'OPEN'
        ? possiblePaths(
            currentValve,
            totalNumValves,
            numSteps - 1,
            new Set([...openValves, action.valve]),
            dropOpenedValveFromFlowRates(
              unopenedValveFlowRatesSorted,
              action.valve,
            ),
            new Set(),
          )
        : possiblePaths(
            action.valve,
            totalNumValves,
            numSteps - 1,
            openValves,
            unopenedValveFlowRatesSorted,
            new Set([...valvesVisitedSinceLastOpen, currentValve]),
          );

    for (const possibleFuturePath of possibleFuturePaths) {
      yield [action, ...possibleFuturePath];
    }
  }
}

function totalFlowForPath(path: ActionOrDontCare[]): number {
  let cumulativeFlow = 0;
  let flowRate = 0;
  for (const action of path) {
    cumulativeFlow += flowRate;

    if (action.type === 'OPEN') {
      flowRate += action.valve.flowRate;
    }
  }
  return cumulativeFlow;
}

function totalFlowForDualPath(
  dualPath: [ActionOrDontCare, ActionOrDontCare][],
): number {
  let cumulativeFlow = 0;
  let flowRate = 0;
  for (const [action1, action2] of dualPath) {
    cumulativeFlow += flowRate;

    if (action1.type === 'OPEN') {
      flowRate += action1.valve.flowRate;
    }
    if (action2.type === 'OPEN') {
      flowRate += action2.valve.flowRate;
    }
  }
  return cumulativeFlow;
}

function dropOpenedValveFromFlowRates(flowRates: number[], valve: Valve) {
  let found = false;
  return flowRates.filter(flowRate => {
    if (found) {
      return true;
    } else {
      if (flowRate === valve.flowRate) {
        found = true;
        return false;
      } else {
        return true;
      }
    }
  });
}
