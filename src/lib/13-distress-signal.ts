export type Packet = number | (number | Packet)[];

export function part1(input: string) {
  const pairsSerialised = input.split('\n\n');
  const pairs = pairsSerialised.map(serialised => {
    const [left, right] = serialised
      .split('\n')
      .slice(0, 2)
      .map(val => JSON.parse(val));
    if (!isValidPacket(left) || !isValidPacket(right)) {
      throw new Error('Invalid input');
    }
    return [left, right];
  });
  const correctOrderIndex = pairs.map(([left, right]) =>
    correctOrder(left, right),
  );

  return correctOrderIndex.reduce(
    (sum, isCorrect, index) => (isCorrect ? sum + index + 1 : sum),
    0,
  );
}

export function part2(input: string) {
  const packets: Packet[] = [];
  const unvalidatePackets = input
    .split('\n')
    .filter(val => val !== '')
    .map(serialised => JSON.parse(serialised));
  for (const packet of unvalidatePackets) {
    if (isValidPacket(packet)) {
      packets.push(packet);
    }
  }

  packets.push([[2]], [[6]]);

  packets.sort((a, b) => (correctOrder(a, b) ? -1 : 1));

  const firstDivider = packets.findIndex(isDividerPacket) + 1;
  const secondDivider = packets.findLastIndex(isDividerPacket) + 1;
  return firstDivider * secondDivider;
}

export function correctOrder(left: Packet, right: Packet): boolean | undefined {
  if (typeof left === 'number' && typeof right === 'number') {
    if (left === right) {
      return;
    } else {
      return left < right;
    }
  } else if (typeof left === 'object' && typeof right === 'object') {
    if (left.length === 0 && right.length === 0) {
      return undefined;
    } else if (left.length === 0) {
      return true;
    } else if (right.length === 0) {
      return false;
    } else {
      const [leftHead, ...leftRest] = left;
      const [rightHead, ...rightRest] = right;
      const headsCorrectOrder = correctOrder(leftHead, rightHead);
      if (headsCorrectOrder !== undefined) {
        return headsCorrectOrder;
      } else {
        return correctOrder(leftRest, rightRest);
      }
    }
  } else {
    if (typeof left === 'number') {
      return correctOrder([left], right);
    } else {
      return correctOrder(left, [right]);
    }
  }
}

function isValidPacket(packet: unknown): packet is Packet {
  return (
    typeof packet === 'number' ||
    (Array.isArray(packet) && packet.every(element => isValidPacket(element)))
  );
}

function isDividerPacket(packet: Packet): boolean {
  return (
    typeof packet === 'object' &&
    packet.length === 1 &&
    typeof packet[0] === 'object' &&
    packet[0].length === 1 &&
    (packet[0][0] === 2 || packet[0][0] === 6)
  );
}
