export interface MonkeyRules {
  operation: {
    operation: '+' | '*';
    operand: number | 'old';
  };
  test: {
    divisible: number;
  };
  ifTest: number;
  else: number;
}

export type Monkeys = Map<
  number,
  {
    rules: MonkeyRules;
    items: number[];
    numInspections: number;
  }
>;

export function part1(input: string): number {
  const monkeys = parseAllMonkeys(input);
  for (let i = 0; i < 20; i++) {
    computeRound(monkeys, true);
  }
  const inspectionNumbers = [...monkeys.values()]
    .map(({ numInspections }) => numInspections)
    .sort((a, b) => a - b)
    .reverse();

  const [top, second] = inspectionNumbers;
  return top * second;
}

export function part2(input: string): number {
  const inspectionNumbers = part2InspectionNumbersForNumRounds(input, 10_000)
    .sort((a, b) => a - b)
    .reverse();

  const [top, second] = inspectionNumbers;
  return top * second;
}

export function part2InspectionNumbersForNumRounds(
  input: string,
  numRounds: number,
): number[] {
  const monkeys = parseAllMonkeys(input);

  const allModulos = [...monkeys.values()].map(
    ({
      rules: {
        test: { divisible },
      },
    }) => divisible,
  );
  const worryModulo = allModulos.reduce((prod, num) => prod * num);

  for (let i = 0; i < numRounds; i++) {
    computeRound(monkeys, false, worryModulo);
  }
  return [...monkeys.values()].map(({ numInspections }) => numInspections);
}

export function parseAllMonkeys(monkeysSerialised: string): Monkeys {
  const details = monkeysSerialised.split('\n\n').map(parseMonkeyDetails);
  return new Map(
    details.map(({ monkeyId, rules, items }) => [
      monkeyId,
      { rules, items, numInspections: 0 },
    ]),
  );
}

export function parseMonkeyDetails(monkeySerialised: string): {
  monkeyId: number;
  rules: MonkeyRules;
  items: number[];
} {
  const [
    idSerialised,
    startingItemsSerialised,
    operationSerialised,
    testSerialised,
    ifTestSerialised,
    elseSerialised,
  ] = monkeySerialised.split('\n');
  const [, id] = idSerialised.split(' ');
  const [, itemsSerialised] = startingItemsSerialised.slice(2).split(': ');
  const [_operation, _new, _equals, _old, operation, operand] =
    operationSerialised.slice(2).split(' ');
  const [_test, _divisible, _by, testDivisible] = testSerialised
    .slice(2)
    .split(' ');
  const ifTest = ifTestSerialised.split(' ').at(-1);
  const ifNotTest = elseSerialised.split(' ').at(-1);
  if (!ifTest || !ifNotTest) {
    throw new Error(`Cannot parse ${ifTestSerialised} / ${elseSerialised}`);
  }
  if (!isValidOperation(operation)) {
    throw new Error(`Cannot parse operation ${operation}`);
  }

  return {
    monkeyId: parseInt(id),
    items: itemsSerialised.split(', ').map(num => parseInt(num)),
    rules: {
      operation: {
        operation,
        operand: operand === 'old' ? 'old' : parseInt(operand),
      },
      test: { divisible: parseInt(testDivisible) },
      ifTest: parseInt(ifTest),
      else: parseInt(ifNotTest),
    },
  };
}

function isValidOperation(op: string): op is '+' | '*' {
  return op === '+' || op === '*';
}

export function computeRound(
  monkeys: Monkeys,
  divideWorry: boolean,
  worryModulo?: number,
) {
  for (const monkey of monkeys.values()) {
    for (const item of monkey.items) {
      monkey.numInspections++;

      const operand =
        monkey.rules.operation.operand === 'old'
          ? item
          : monkey.rules.operation.operand;
      const intermediateValue =
        monkey.rules.operation.operation === '+'
          ? item + operand
          : item * operand;
      const intermediateValueAfterDivide = divideWorry
        ? Math.floor(intermediateValue / 3)
        : intermediateValue;
      const newValue = worryModulo
        ? intermediateValueAfterDivide % worryModulo
        : intermediateValueAfterDivide;

      const monkeyIdToThrowTo =
        newValue % monkey.rules.test.divisible === 0
          ? monkey.rules.ifTest
          : monkey.rules.else;
      const monkeyToThrowTo = monkeys.get(monkeyIdToThrowTo);
      if (!monkeyToThrowTo) {
        throw new Error(`Cannot find monkey ${monkeyIdToThrowTo}`);
      }

      monkeyToThrowTo.items.push(newValue);
    }

    monkey.items = [];
  }
}
