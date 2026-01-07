import { sumByProperty } from './sumByProperty';

jest.mock('./logging');

describe('src/utils/sumByProperty.ts', () => {
  it('sums the numeric values held by specified property', () => {
    expect(sumByProperty([{ x: 1 }, { x: 2 }, { x: 3 }], 'x')).toEqual(6);
    expect(sumByProperty([{ x: -1 }, { x: -2 }, { x: 3 }], 'x')).toEqual(0);
  });

  it('ignores the non-numeric values', () => {
    expect(
      sumByProperty(
        [{ x: 'not a number' }, { x: 2 }, { x: null }, { x: -10 }, { x: 5 }],
        'x',
      ),
    ).toEqual(-3);
  });
});
