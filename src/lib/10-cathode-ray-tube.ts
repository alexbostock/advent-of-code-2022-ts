export interface Environment {
  x: number;
}

export function part1(input: string): number {
  const instructions = input.split('\n').filter(val => val !== '');
  const envHistory = createEnvHistory(instructions);
  return [20, 60, 100, 140, 180, 220]
    .map(index => envHistory[index - 1].x * index)
    .reduce((sum, num) => sum + num);
}

export function part2(input: string): string {
  const instructions = input.split('\n').filter(val => val !== '');
  const envHistory = createEnvHistory(instructions);
  return envHistory.reduce((screen, env, index) => {
    const nextPixel = Math.abs(env.x - (index % 40)) <= 1 ? '#' : ' ';
    return index % 40 === 39
      ? `${screen}${nextPixel}\n`
      : `${screen}${nextPixel}`;
  }, '');
}

export function createEnvHistory(instructions: string[]): Environment[] {
  const envHistory: Environment[] = [{ x: 1 }];
  for (const instruction of instructions) {
    const currentEnv = envHistory[envHistory.length - 1];
    envHistory.push(...applyInstruction(currentEnv, instruction));
  }
  return envHistory;
}

export function applyInstruction(
  env: Environment,
  instruction: string,
): Environment[] {
  if (instruction === 'noop') {
    return [env];
  } else {
    const [opcode, operand] = instruction.split(' ');
    if (opcode !== 'addx') {
      throw new Error(`Invalid opcode: ${opcode}`);
    }
    return [
      env,
      {
        x: env.x + parseInt(operand),
      },
    ];
  }
}
