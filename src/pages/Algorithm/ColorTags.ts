export {};
const hexCharacters = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  'A',
  'B',
  'C',
  'D',
  'E',
  'F'
];

function getCharacter(index: number) {
  return hexCharacters[index];
}

function generateNewColor() {
  let hexColorRep = '#';

  for (let index = 0; index < 6; index++) {
    const randomPosition = Math.floor(Math.random() * hexCharacters.length);
    hexColorRep += getCharacter(randomPosition);
  }

  return hexColorRep;
}

console.log(generateNewColor());

const tags = [
  '2-sat',
  'binary search',
  'bitmasks',
  'brute force',
  'chinese remainder theorem',
  'combinatorics',
  'constructive algorithms',
  'data structures',
  'dfs and similar',
  'divide and conquer',
  'dp',
  'dsu',
  'expression parsing',
  'fft',
  'flows',
  'games',
  'geometry',
  'graph matchings',
  'graphs',
  'greedy',
  'hashing',
  'id',
  'implementation',
  'interactive',
  'math',
  'matrices',
  'meet-in-the-middle',
  'number theory',
  'probabilities',
  'schedules',
  'shortest paths',
  'sortings',
  'string suffix structures',
  'strings',
  'ternary search',
  'trees',
  'two pointers'
];
let colors = new Map<string, { bg: string; content: string }>();
function invertColor(color: string) {
  return (
    '#' +
    (
      '000000' + (0xffffff ^ parseInt(color.substring(1), 16)).toString(16)
    ).slice(-6)
  );
}
tags.forEach(tag => {
  const bg = generateNewColor();
  const content = invertColor(bg);
  colors.set(tag, {
    bg: bg,
    content: content
  });
});
export default colors;
