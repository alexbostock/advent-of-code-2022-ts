export interface RangeInclusive {
  start: number;
  end: number;
}

export function part1(input: string): number {
  const pairsSerialised = input.split('\n').filter(val => val !== '');
  return pairsSerialised
    .map(parseRanges)
    .filter(
      ([range1, range2]) =>
        rangeFullyContains(range1, range2) ||
        rangeFullyContains(range2, range1),
    ).length;
}

export function part2(input: string): number {
  const pairsSerialised = input.split('\n').filter(val => val !== '');
  return pairsSerialised
    .map(parseRanges)
    .filter(([range1, range2]) => rangesOverlap(range1, range2)).length;
}

export function parseRanges(
  serialised: string,
): [RangeInclusive, RangeInclusive] {
  const [serialised1, serialised2] = serialised.split(',');
  return [parseRange(serialised1), parseRange(serialised2)];
}

function parseRange(serialised: string): RangeInclusive {
  const [start, end] = serialised.split('-');
  return { start: parseInt(start), end: parseInt(end) };
}

export function rangeFullyContains(
  range: RangeInclusive,
  otherRange: RangeInclusive,
): boolean {
  return range.start <= otherRange.start && range.end >= otherRange.end;
}

export function rangesOverlap(
  range1: RangeInclusive,
  range2: RangeInclusive,
): boolean {
  return (
    (range1.start <= range2.end && range1.end >= range2.end) ||
    (range2.start <= range1.end && range2.end >= range1.end)
  );
}
