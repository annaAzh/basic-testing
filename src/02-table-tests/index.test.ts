import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Add, expected: 5 },
  { a: -1, b: -1, action: Action.Divide, expected: 1 },
  { a: -1, b: -1, action: Action.Subtract, expected: 0 },
  { a: -1, b: -1, action: Action.Multiply, expected: 1 },
  { a: 2, b: 0, action: Action.Exponentiate, expected: 1 },
  { a: 2, b: null, action: Action.Add, expected: null },
  { a: 2, b: 0, action: 'Action.Exponentiate', expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'while use %i and %i with %o the result should be %i',
    ({ a, b, action, expected }) => {
      expect(simpleCalculator({ a, b, action })).toBe(expected);
    },
  );
});
