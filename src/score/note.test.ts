import { parseNote } from './note';

test('parseNote', () => {
  const cases: [string, number][] = [
    ['c4', 60],
    ['c#4', 61],
    ['db4', 61],
    ['d4', 62],
    ['e4', 64],
    ['f4', 65],
    ['g4', 67],
    ['a4', 69],
    ['b4', 71],
    ['c5', 72],
    ['c3', 48],
  ];
  for (const [input, expected] of cases) {
    const output = parseNote(input);
    if (output != expected) {
      throw new Error(
        `parseNote(${JSON.stringify(input)}) = ${JSON.stringify(output)}, ` +
          `want ${JSON.stringify(expected)}`,
      );
    }
  }
});