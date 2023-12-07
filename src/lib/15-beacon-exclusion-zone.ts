interface Coords {
  x: number;
  y: number;
}

export function part1(input: string): number {
  return part1Impl(input, 2000000);
}

export function part1Impl(input: string, rowNumber: number): number {
  const sensorReadings = input.split('\n').filter(val => val !== '');
  const sensorBeaconPairs = sensorReadings.map(parseSensorReading);

  const allXValues = sensorBeaconPairs.flatMap(({ sensor, beacon }) => [
    sensor.x,
    beacon.x,
  ]);
  const maxX = Math.max(...allXValues);
  const minX = Math.min(...allXValues);

  let count = 0;
  for (let x = minX; x <= maxX; x++) {
    if (cannotContainBeacon({ x, y: rowNumber }, sensorBeaconPairs)) {
      if (
        sensorBeaconPairs.some(
          ({ beacon }) => x === beacon.x && rowNumber === beacon.y,
        )
      ) {
        continue;
      }
      count++;
    }
  }
  return count;
}

export function part2(input: string) {
  return part2Impl(input, 4000000);
}

export function part2Impl(
  input: string,
  maximumCoordComponent: number,
): number {
  const sensorReadings = input.split('\n').filter(val => val !== '');
  const sensorBeaconPairs = sensorReadings
    .map(parseSensorReading)
    .sort((a, b) => a.distance - b.distance)
    .reverse();

  const knownBeaconPositions = new Set(
    sensorBeaconPairs.map(({ beacon }) => beacon.x * 4000000 + beacon.y),
  );

  const [rangeStart, rangeEnd] = pickRange(maximumCoordComponent);
  return searchRange(
    sensorBeaconPairs,
    knownBeaconPositions,
    maximumCoordComponent,
    rangeStart,
    rangeEnd,
  );
}

function pickRange(maximumCoordComponent: number) {
  if (process.env.VITEST) {
    return [0, maximumCoordComponent];
  }

  const threadNumber = parseInt(process.argv[3]);
  if (![0, 1, 2, 3].includes(threadNumber)) {
    throw new Error('Invalid thread number');
  }

  const rangeSizePerThread = maximumCoordComponent / 4;
  const rangeStart = rangeSizePerThread * threadNumber;
  const rangeEnd = rangeSizePerThread * (threadNumber + 1) - 1;

  return [rangeStart, rangeEnd];
}

function searchRange(
  sensorBeaconPairs: { sensor: Coords; beacon: Coords; distance: number }[],
  knownBeaconPositions: Set<number>,
  maximumCoordComponent: number,
  rangeStart: number,
  rangeEnd: number,
) {
  for (let x = rangeStart; x <= rangeEnd; x++) {
    for (let y = 0; y <= maximumCoordComponent; y++) {
      if (!cannotContainBeacon({ x, y }, sensorBeaconPairs)) {
        const tuningFrequency = x * 4000000 + y;
        if (knownBeaconPositions.has(tuningFrequency)) {
          continue;
        }
        return tuningFrequency;
      }
    }
  }

  throw new Error('Solution not found');
}

export function parseSensorReading(reading: string): {
  sensor: Coords;
  beacon: Coords;
  distance: number;
} {
  const [sensorSerialised, beaconSerialised] = reading
    .slice(10)
    .split(': closest beacon is at ');
  const [sensorXSerialised, sensorYSerialised] = sensorSerialised.split(', ');
  const [beaconXSerialised, beaconYSerialised] = beaconSerialised.split(', ');
  const [, sensorX] = sensorXSerialised.split('=');
  const [, sensorY] = sensorYSerialised.split('=');
  const [, beaconX] = beaconXSerialised.split('=');
  const [, beaconY] = beaconYSerialised.split('=');

  const sensor = {
    x: parseInt(sensorX),
    y: parseInt(sensorY),
  };
  const beacon = {
    x: parseInt(beaconX),
    y: parseInt(beaconY),
  };

  return {
    sensor,
    beacon,
    distance: manhattanDistance(sensor, beacon),
  };
}

function cannotContainBeacon(
  position: Coords,
  sensorBeaconPairs: { sensor: Coords; distance: number }[],
) {
  return sensorBeaconPairs.some(
    ({ sensor, distance }) => manhattanDistance(sensor, position) <= distance,
  );
}

function manhattanDistance(p1: Coords, p2: Coords) {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}
