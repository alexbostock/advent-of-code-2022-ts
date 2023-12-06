interface Node {
  isStart: boolean;
  isDestination: boolean;
  elevation: string;
  neighbours: Node[];
  directionToGoal?: Node;
  rowNumber: number;
  columnNumber: number;
}

export function part1(input: string) {
  const nodes = parseInput(input);
  const nodesFlat: Node[] = nodes.flat();

  const destinationNode = nodesFlat.find(({ isDestination }) => isDestination);
  if (!destinationNode) {
    throw new Error('Cannot find destination node');
  }
  const startNode = nodesFlat.find(({ isStart }) => isStart);
  if (!startNode) {
    throw new Error('Cannot find start node');
  }

  labelNeigbours(nodes, nodesFlat);
  searchForPaths(nodes, destinationNode);

  return followPath(nodes, startNode);
}

function parseInput(input: string): Node[][] {
  const rows = input.split('\n').filter(val => val !== '');
  return rows.map((row, rowNumber) =>
    row.split('').map((square, columnNumber) => {
      const elevation = elevationOfSquare(square);
      return {
        isStart: square === 'S',
        isDestination: square === 'E',
        elevation,
        neighbours: [],
        rowNumber,
        columnNumber,
      };
    }),
  );
}

export function part2(input: string) {
  const nodes = parseInput(input);
  const nodesFlat = nodes.flat();

  const destinationNode = nodesFlat.find(({ isDestination }) => isDestination);
  if (!destinationNode) {
    throw new Error('Cannot find destination node');
  }

  labelNeigbours(nodes, nodesFlat);
  searchForPaths(nodes, destinationNode);

  const lowestElevationNodes = nodesFlat.filter(
    ({ elevation }) => elevation === 'a',
  );
  const routeLengths = lowestElevationNodes.map(startNode => {
    try {
      return followPath(nodes, startNode);
    } catch (err) {
      return Infinity;
    }
  });
  return Math.min(...routeLengths);
}

function elevationOfSquare(square: string) {
  switch (square) {
    case 'S':
      return 'a';
    case 'E':
      return 'z';
    default:
      return square;
  }
}

function labelNeigbours(nodes: Node[][], nodesFlat: Node[]) {
  for (const row of nodes) {
    for (const node of row) {
      const adjacentSquares = nodesFlat.filter(
        otherNode =>
          (node.rowNumber === otherNode.rowNumber &&
            Math.abs(node.columnNumber - otherNode.columnNumber) === 1) ||
          (node.columnNumber === otherNode.columnNumber &&
            Math.abs(node.rowNumber - otherNode.rowNumber) === 1),
      );

      node.neighbours = adjacentSquares.filter(
        otherNode =>
          node.elevation.charCodeAt(0) - otherNode.elevation.charCodeAt(0) <= 1,
      );
    }
  }
}

function searchForPaths(nodes: Node[][], destinationNode: Node) {
  const queue: Node[] = [destinationNode];
  while (queue.length > 0) {
    const node = queue.shift();
    if (!node) {
      break;
    }
    for (const neighbour of node.neighbours) {
      if (!neighbour.isDestination && !neighbour.directionToGoal) {
        neighbour.directionToGoal = node;
        queue.push(neighbour);
      }
    }
  }
}

function followPath(nodes: Node[][], startNode: Node): number {
  let node = startNode;
  let stepsTaken = 0;
  while (node.directionToGoal) {
    node = node.directionToGoal;
    stepsTaken++;
  }
  if (!node.isDestination) {
    throw new Error('Path ended not at destination');
  }
  return stepsTaken;
}
