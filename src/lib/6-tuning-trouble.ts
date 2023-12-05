export function part1(input: string): number {
  return findMarker(input, 4);
}

export function part2(input: string): number {
  return findMarker(input, 14);
}

function findMarker(input: string, markerSize: number): number {
  for (let i = 0; i < input.length - markerSize; i++) {
    const candidateMarker = input.slice(i, i + markerSize);
    const uniqueCharacters = new Set(candidateMarker.split(''));
    if (uniqueCharacters.size === markerSize) {
      return i + markerSize;
    }
  }
  throw new Error('marker not found');
}
