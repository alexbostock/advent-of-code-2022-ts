export function part1(input: string): number {
  const rucksacks = input.split('\n').filter(val => val !== '');
  return rucksacks
    .map(overlappingItem)
    .map(scoreItem)
    .reduce((sum, num) => sum + num);
}

export function part2(input: string): number {
  const rucksacks = input.split('\n').filter(val => val !== '');
  const badges: string[] = [];
  for (let i = 0; i < rucksacks.length; i += 3) {
    const rucksacksInGroup = rucksacks.slice(i, i + 3).join('\n');
    badges.push(findBadge(rucksacksInGroup));
  }

  return badges.map(scoreItem).reduce((sum, num) => sum + num);
}

export function overlappingItem(rucksackContents: string): string {
  const midpoint = rucksackContents.length / 2;
  const compartment1Items = new Set(
    rucksackContents.slice(0, midpoint).split(''),
  );
  const compartment2Items = rucksackContents.slice(midpoint).split('');
  const overlap = compartment2Items.find(item => compartment1Items.has(item));
  if (!overlap) {
    throw new Error('No overlap found between compartments');
  }
  return overlap;
}

function scoreItem(item: string): number {
  const asciiCode = item.charCodeAt(0);
  return asciiCode >= 97 ? asciiCode - 97 + 1 : asciiCode - 65 + 27;
}

export function findBadge(rucksacks: string): string {
  const [rucksack1, rucksack2, rucksack3] = rucksacks.split('\n');
  const rucksack1Items = new Set(rucksack1.split(''));
  const rucksack2Items = new Set(rucksack2.split(''));
  const badge = rucksack3
    .split('')
    .find(item => rucksack1Items.has(item) && rucksack2Items.has(item));
  if (!badge) {
    throw new Error('Badge not found');
  }
  return badge;
}
