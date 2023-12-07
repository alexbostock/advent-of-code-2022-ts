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

  for (let x = 0; x <= maximumCoordComponent; x++) {
    for (let y = 0; y <= maximumCoordComponent; y++) {
      const { position, tuningFrequency } = testPositionFast(
        { x, y },
        sensorBeaconPairs,
        knownBeaconPositions,
      );
      if (tuningFrequency) {
        return tuningFrequency;
      } else if (position) {
        x = position.x;
        y = position.y;
      }
    }
  }

  throw new Error('Solution not found');
}

function testPositionFast(
  position: Coords,
  sensorBeaconPairs: { sensor: Coords; distance: number }[],
  knownBeaconPositions: Set<number>,
): { tuningFrequency?: number; position?: Coords } {
  for (const { sensor, distance } of sensorBeaconPairs) {
    const withinZone = manhattanDistance(position, sensor) <= distance;
    if (withinZone) {
      const xDistanceToBeacon = Math.abs(sensor.x - position.x);
      position.y = sensor.y + distance - xDistanceToBeacon;
      return {
        position,
      };
    }
  }

  const tuningFrequency = position.x * 4000000 + position.y;
  if (knownBeaconPositions.has(tuningFrequency)) {
    return { position };
  }
  return { tuningFrequency };
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
