export interface Coords {
  x: number;
  y: number;
}

export interface RopeState {
  head: Coords;
  tail: Coords;
}

export interface LongRopeState {
  knots: Coords[]; // Head first
}

export type Instruction = 'L' | 'R' | 'U' | 'D';

export function part1(input: string): number {
  const tailPositions = new Set<string>(); // Serialised coords

  let state: RopeState = {
    head: { x: 0, y: 0 },
    tail: { x: 0, y: 0 },
  };
  tailPositions.add(serialisedCoords(state.tail));

  for (const instruction of parseInstructions(input)) {
    state = nextState(state, instruction);
    tailPositions.add(serialisedCoords(state.tail));
  }
  return tailPositions.size;
}

export function part2(input: string): number {
  const tailPositions = new Set<string>(); // Serialised coords;

  let state: LongRopeState = {
    knots: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(() => ({ x: 0, y: 0 })),
  };

  for (const instruction of parseInstructions(input)) {
    state = nextLongRopeState(state, instruction);
    const tail = state.knots.at(-1);
    if (!tail) {
      throw new Error('Cannot find tail');
    }
    tailPositions.add(serialisedCoords(tail));
  }
  return tailPositions.size;
}

export function* parseInstructions(input: string): Generator<Instruction> {
  const lines = input.split('\n').filter(val => val !== '');
  for (const line of lines) {
    const [direction, num] = line.split(' ');
    if (!isValidInstruction(direction)) {
      throw new Error(`Invalid instruction: ${line}`);
    }
    for (let i = 0; i < parseInt(num); i++) {
      yield direction;
    }
  }
}

function isValidInstruction(dir: string): dir is Instruction {
  return ['L', 'R', 'U', 'D'].includes(dir);
}

export function nextState(
  state: RopeState,
  instruction: Instruction,
): RopeState {
  const newHeadPosition = translateCoordinates(state.head, instruction);
  return {
    head: newHeadPosition,
    tail: newTailPosition(newHeadPosition, state.tail),
  };
}

export function nextLongRopeState(
  state: LongRopeState,
  instruction: Instruction,
): LongRopeState {
  return {
    knots: state.knots.reduce(
      (updatedKnots: Coords[], currentPosition: Coords) => {
        if (updatedKnots.length === 0) {
          return [
            ...updatedKnots,
            translateCoordinates(currentPosition, instruction),
          ];
        } else {
          const positionToFollow = updatedKnots.at(-1);
          if (!positionToFollow) {
            throw new Error('Invalid data');
          }
          return [
            ...updatedKnots,
            newTailPosition(positionToFollow, currentPosition),
          ];
        }
      },
      [],
    ),
  };
}

function translateCoordinates(coords: Coords, direction: Instruction) {
  const { x, y } = coords;
  switch (direction) {
    case 'R':
      return { x: x + 1, y };
    case 'L':
      return { x: x - 1, y };
    case 'U':
      return { x, y: y + 1 };
    case 'D':
      return { x, y: y - 1 };
  }
}

export function newTailPosition(
  newHeadPosition: Coords,
  currentTailPosition: Coords,
): Coords {
  const horizontalDistance = newHeadPosition.x - currentTailPosition.x;
  const verticalDistance = newHeadPosition.y - currentTailPosition.y;

  if (Math.abs(horizontalDistance) > 1) {
    if (Math.abs(horizontalDistance) === Math.abs(verticalDistance)) {
      return {
        x:
          horizontalDistance > 0
            ? newHeadPosition.x - 1
            : newHeadPosition.x + 1,
        y: verticalDistance > 0 ? newHeadPosition.y - 1 : newHeadPosition.y + 1,
      };
    } else if (Math.abs(horizontalDistance) > Math.abs(verticalDistance)) {
      return {
        x:
          horizontalDistance > 0
            ? newHeadPosition.x - 1
            : newHeadPosition.x + 1,
        y: newHeadPosition.y,
      };
    } else {
      return {
        x: newHeadPosition.x,
        y: verticalDistance > 0 ? newHeadPosition.y - 1 : newHeadPosition.y + 1,
      };
    }
  } else if (Math.abs(verticalDistance) > 1) {
    return {
      x: newHeadPosition.x,
      y: verticalDistance > 0 ? newHeadPosition.y - 1 : newHeadPosition.y + 1,
    };
  } else {
    return currentTailPosition;
  }
}

function serialisedCoords(coords: Coords): string {
  return `${coords.x}:${coords.y}`;
}
