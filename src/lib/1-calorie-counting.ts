export function part1(input: string) {
  const lists = input.split('\n\n');
  const caloriesByElf = lists.map(sumCaloriesInList);
  return Math.max(...caloriesByElf);
}

export function part2(input: string) {
  const lists = input.split('\n\n');
  const caloriesByElf = lists.map(sumCaloriesInList);
  const top3 = caloriesByElf
    .sort((a, b) => a - b)
    .reverse()
    .slice(0, 3);
  return top3.reduce((sum, num) => sum + num);
}

export function sumCaloriesInList(serialised: string) {
  const counts = serialised
    .split('\n')
    .filter(val => val !== '')
    .map(num => parseInt(num));

  return counts.reduce((sum, num) => sum + num);
}
