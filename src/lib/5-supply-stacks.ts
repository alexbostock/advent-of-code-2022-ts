export type Stacks = Map<string, string[]>; // ID => crates (top crate last)

export interface Instruction {
  source: string;
  destination: string;
  number: number;
}

export function part1(input: string): string {
  const [stacksSerialised, instructionsSerialised] = input.split('\n\n');
  const stacks = parseStacks(stacksSerialised);
  const instructions = parseInstructions(instructionsSerialised);
  for (const instruction of instructions) {
    applyInstruction(stacks, instruction);
  }
  return [...stacks.values()].map(stack => stack.at(-1)).join('');
}

export function part2(input: string): string {
  const [stacksSerialised, instructionsSerialised] = input.split('\n\n');
  const stacks = parseStacks(stacksSerialised);
  const instructions = parseInstructions(instructionsSerialised);
  for (const instruction of instructions) {
    applyInstruction9001(stacks, instruction);
  }
  return [...stacks.values()].map(stack => stack.at(-1)).join('');
}

export function parseStacks(stacksSerialised: string): Stacks {
  const stacks: string[][] = [];
  const stackIds: string[] = [];

  for (const [rowNumber, line] of stacksSerialised.split('\n').entries()) {
    let toProcess = line;
    let stackNumber = -1;
    while (toProcess.length > 0) {
      stackNumber++;
      if (rowNumber === 0) {
        stacks.push([]);
      }
      const token = toProcess.slice(0, 3);
      toProcess = toProcess.slice(4);
      if (token === '   ') {
        continue;
      }
      if (token[0] === '[') {
        const stack = stacks[stackNumber];
        stack.unshift(token[1]);
      } else {
        stackIds.push(token[1]);
      }
    }
  }
  return new Map(stacks.map((crates, index) => [stackIds[index], crates]));
}

export function parseInstructions(
  instructionsSerialised: string,
): Instruction[] {
  return instructionsSerialised
    .split('\n')
    .filter(val => val !== '')
    .map(serialised => {
      const [num, from, to] = serialised
        .split(' ')
        .filter(val => val !== 'move' && val !== 'from' && val !== 'to');
      return {
        number: parseInt(num),
        source: from,
        destination: to,
      };
    });
}

export function applyInstruction(stacks: Stacks, instruction: Instruction) {
  const sourceStack = stacks.get(instruction.source);
  const destStack = stacks.get(instruction.destination);
  if (!sourceStack) {
    throw new Error('Cannot find source stack');
  }
  if (!destStack) {
    throw new Error('Cannot find destination stack');
  }

  for (let i = 0; i < instruction.number; i++) {
    const crate = sourceStack.pop();
    if (!crate) {
      throw new Error('Source stack empty');
    }
    destStack.push(crate);
  }
}

export function applyInstruction9001(stacks: Stacks, instruction: Instruction) {
  const sourceStack = stacks.get(instruction.source);
  const destStack = stacks.get(instruction.destination);
  if (!sourceStack) {
    throw new Error('Cannot find source stack');
  }
  if (!destStack) {
    throw new Error('Cannot find destination stack');
  }

  const movedCrates: string[] = [];
  for (let i = 0; i < instruction.number; i++) {
    const crate = sourceStack.pop();
    if (!crate) {
      throw new Error('Source stace empty');
    }
    movedCrates.unshift(crate);
  }
  destStack.push(...movedCrates);
}
