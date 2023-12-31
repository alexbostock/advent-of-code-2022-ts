import { open } from 'node:fs/promises';
import * as day1 from './lib/1-calorie-counting.js';
import * as day10 from './lib/10-cathode-ray-tube.js';
import * as day11 from './lib/11-monkey-in-the-middle.js';
import * as day12 from './lib/12-hill-climbing-algorithm.js';
import * as day13 from './lib/13-distress-signal.js';
import * as day14 from './lib/14-regolith-reservoir.js';
import * as day15 from './lib/15-beacon-exclusion-zone.js';
import * as day2 from './lib/2-rock-paper-scissors.js';
import * as day3 from './lib/3-rucksack-reorganisation.js';
import * as day4 from './lib/4-camp-cleanup.js';
import * as day5 from './lib/5-supply-stacks.js';
import * as day6 from './lib/6-tuning-trouble.js';
import * as day7 from './lib/7-no-space-left-on-device.js';
import * as day8 from './lib/8-treetrop-tree-house.js';
import * as day9 from './lib/9-rope-bridge.js';

const puzzleKey = process.argv[2];

const [day, part] = puzzleKey.split('.');

const puzzles = [
  day1,
  day2,
  day3,
  day4,
  day5,
  day6,
  day7,
  day8,
  day9,
  day10,
  day11,
  day12,
  day13,
  day14,
  day15,
];

const puzzle = puzzles[parseInt(day) - 1];
const puzzlePart = part === '1' ? puzzle.part1 : puzzle.part2;

const inputFile = await open(`input/${day}.txt`);
const inputData = await inputFile.readFile('utf8');
await inputFile.close();
const solution = puzzlePart(inputData);
console.log(solution);
