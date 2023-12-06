export function part1(input: string): number {
  const rows = input
    .split('\n')
    .filter(val => val !== '')
    .map(line => line.split('').map(height => parseInt(height)));
  const treesVisible = rows.flatMap((row, rowNumber) =>
    row.map((_tree, columnNumber) =>
      treeVisible(rows, rowNumber, columnNumber),
    ),
  );
  return treesVisible.reduce(
    (numVisible, visible) => (visible ? numVisible + 1 : numVisible),
    0,
  );
}

export function part2(input: string): number {
  const rows = input
    .split('\n')
    .filter(val => val !== '')
    .map(line => line.split('').map(height => parseInt(height)));
  const scenicScores = rows.flatMap((row, rowNumber) =>
    row.map((_tree, columnNumber) =>
      scenicScore(rows, rowNumber, columnNumber),
    ),
  );
  return Math.max(...scenicScores);
}

export function treeVisible(
  rows: number[][],
  rowNumber: number,
  columnNumber: number,
) {
  const treeHeight = rows[rowNumber][columnNumber];

  const treesToLeft = rows[rowNumber].slice(0, columnNumber);
  const treesToRight = rows[rowNumber].slice(columnNumber + 1);
  const treesToTop = rows.slice(0, rowNumber).map(row => row[columnNumber]);
  const treesToBottom = rows.slice(rowNumber + 1).map(row => row[columnNumber]);

  return [treesToLeft, treesToRight, treesToTop, treesToBottom].some(
    lineOfTrees => lineOfTrees.every(tree => tree < treeHeight),
  );
}

export function scenicScore(
  rows: number[][],
  rowNumber: number,
  columnNumber: number,
): number {
  const treesToLeft = rows[rowNumber].slice(0, columnNumber).reverse();
  const treesToRight = rows[rowNumber].slice(columnNumber + 1);
  const treesToTop = rows
    .slice(0, rowNumber)
    .map(row => row[columnNumber])
    .reverse();
  const treesToBottom = rows.slice(rowNumber + 1).map(row => row[columnNumber]);

  const score = [treesToLeft, treesToRight, treesToTop, treesToBottom]
    .map(trees => numTreesVisible(trees, rows[rowNumber][columnNumber]))
    .reduce((prod, num) => prod * num);
  return score;
}

export function numTreesVisible(trees: number[], houseHeight: number): number {
  let count = 0;
  for (const height of trees) {
    if (height < houseHeight) {
      count++;
    } else {
      count++;
      break;
    }
  }
  return count;
}
