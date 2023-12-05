import { open } from 'node:fs/promises';
import * as day1 from './lib/1-calorie-counting.js';
import * as day2 from './lib/2-rock-paper-scissors.js';
import * as day3 from './lib/3-rucksack-reorganisation.js';

const puzzleKey = process.argv[2];

const [day] = puzzleKey.split('.');

const puzzleMap: Record<string, (input: string) => unknown> = {
  '1.1': day1.part1,
  '1.2': day1.part2,
  '2.1': day2.part1,
  '2.2': day2.part2,
  '3.1': day3.part1,
  '3.2': day3.part2,
};

const puzzle = puzzleMap[puzzleKey];

if (!puzzle) {
  throw new Error(`Cannot find puzzle ${puzzleKey}`);
}

const inputFile = await open(`input/${day}.txt`);
const inputData = await inputFile.readFile('utf8');
await inputFile.close();
const solution = puzzle(inputData);
console.log(solution);
