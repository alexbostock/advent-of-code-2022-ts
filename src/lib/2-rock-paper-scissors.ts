export function part1(input: string) {
  const hands = input.split('\n');
  return hands.map(scoreHand).reduce((sum, num) => sum + num);
}

export function part2(input: string) {
  const hands = input.split('\n').filter(val => val !== '');
  return hands
    .map(strategy => {
      const [other] = strategy;
      const me = decidePlay(strategy);
      return scoreHand(`${other} ${me}`);
    })
    .reduce((sum, num) => sum + num);
}

function decidePlay(input: string) {
  const [other, aim] = input.split(' ');
  if (aim === 'X') {
    // Lose
    if (other === 'A') {
      return 'Z';
    } else if (other === 'B') {
      return 'X';
    } else {
      return 'Y';
    }
  } else if (aim === 'Y') {
    // Draw
    if (other === 'A') {
      return 'X';
    } else if (other === 'B') {
      return 'Y';
    } else {
      return 'Z';
    }
  } else {
    // Win
    if (other === 'A') {
      return 'Y';
    } else if (other === 'B') {
      return 'Z';
    } else {
      return 'X';
    }
  }
}

function scoreHand(input: string) {
  const [other, me] = input.split(' ');
  let score = 0;
  switch (me) {
    case 'X':
      score += 1;
      break;
    case 'Y':
      score += 2;
      break;
    case 'Z':
      score += 3;
      break;
  }
  const iWin =
    (me === 'X' && other === 'C') ||
    (me === 'Y' && other === 'A') ||
    (me === 'Z' && other === 'B');
  const draw =
    (me === 'X' && other === 'A') ||
    (me === 'Y' && other === 'B') ||
    (me === 'Z' && other === 'C');
  if (iWin) {
    score += 6;
  } else if (draw) {
    score += 3;
  }
  return score;
}
