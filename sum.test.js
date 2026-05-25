const { sum } = require('./sum');

describe('sum', () => {
  test('dodaje dwie liczby dodatnie', () => {
    expect(sum(2, 3)).toBe(5);
  });

  test('dodaje liczby ujemne i zero', () => {
    expect(sum(-1, 1)).toBe(0);
    expect(sum(0, 0)).toBe(0);
  });
});
