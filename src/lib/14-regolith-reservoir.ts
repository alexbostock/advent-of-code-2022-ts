export function part1(input: string): number {
  const cave = new Cave(input);
  let numUnitsSand = 0;
  while (!cave.dropSand(500, 0)) {
    numUnitsSand++;
  }
  return numUnitsSand;
}

export function part2(input: string): number {
  const cave = new Cave(input, true);
  let numUnitsSand = 0;
  while (!cave.positionOccupied(500, 0)) {
    cave.dropSand(500, 0);
    numUnitsSand++;
  }
  return numUnitsSand;
}

export class Cave {
  rockPositions: Set<string>;
  sandPositions: Set<string>;
  abyssFloorY: number;
  abyssIsFloor: boolean;

  constructor(serialised: string, abyssIsFloor?: boolean) {
    const paths = serialised.split('\n').filter(val => val !== '');
    const rockPositions = paths.flatMap(parsePath);

    this.rockPositions = new Set(
      rockPositions.map(({ x, y }) => serialisedCoords(x, y)),
    );
    const lowestRockY = Math.max(...rockPositions.map(({ y }) => y));
    this.abyssFloorY = lowestRockY + 2;

    this.sandPositions = new Set();
    this.abyssIsFloor = abyssIsFloor ?? false;
  }

  positionOccupied(x: number, y: number) {
    if (this.abyssIsFloor && y === this.abyssFloorY) {
      return true;
    }
    const serialised = serialisedCoords(x, y);
    return (
      this.rockPositions.has(serialised) || this.sandPositions.has(serialised)
    );
  }

  dropSand(x: number, y: number) {
    let sandPosition = { x, y };
    while (sandPosition.y < this.abyssFloorY) {
      const possibleNextPositions = [
        {
          x: sandPosition.x,
          y: sandPosition.y + 1,
        },
        {
          x: sandPosition.x - 1,
          y: sandPosition.y + 1,
        },
        {
          x: sandPosition.x + 1,
          y: sandPosition.y + 1,
        },
      ].filter(({ x, y }) => !this.positionOccupied(x, y));

      if (possibleNextPositions.length === 0) {
        this.sandPositions.add(
          serialisedCoords(sandPosition.x, sandPosition.y),
        );
        break;
      } else {
        sandPosition = possibleNextPositions[0];
      }
    }

    return sandPosition.y === this.abyssFloorY;
  }
}

function parsePath(serialised: string) {
  const points: { x: number; y: number }[] = [];

  const vertices = serialised.split(' -> ').map(vertexSerialised => {
    const [x, y] = vertexSerialised.split(',').map(num => parseInt(num));
    return { x, y };
  });
  const cursor = vertices[0];
  for (const nextVertex of vertices.slice(1)) {
    const xDiff = nextVertex.x - cursor.x;
    const yDiff = nextVertex.y - cursor.y;
    const xDir = xDiff === 0 ? 0 : xDiff / Math.abs(xDiff);
    const yDir = yDiff === 0 ? 0 : yDiff / Math.abs(yDiff);

    points.push({ x: cursor.x, y: cursor.y });
    while (cursor.x !== nextVertex.x || cursor.y !== nextVertex.y) {
      cursor.x += xDir;
      cursor.y += yDir;
      points.push({ x: cursor.x, y: cursor.y });
    }
  }

  return points;
}

function serialisedCoords(x: number, y: number) {
  return `${x}:${y}`;
}
