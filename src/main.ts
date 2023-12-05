import { open } from 'node:fs/promises';
import * as day1 from './lib/1-calorie-counting.js';
import * as day2 from './lib/2-rock-paper-scissors.js';

const puzzleKey = process.argv[2];

const [day] = puzzleKey.split('.');

const puzzleMap: Record<string, (input: string) => unknown> = {
  '1.1': day1.part1,
  '1.2': day1.part2,
  '2.1': day2.part1,
  '2.2': day2.part2,
};

const puzzle = puzzleMap[puzzleKey];

if (!puzzle) {
  throw new Error(`Cannot find puzzle ${puzzleKey}`);
}

const inputFile = await open(`input/${day}.txt`);
const inputData = await inputFile.readFile('utf8');
const solution = puzzle(inputData);
console.log(solution);
