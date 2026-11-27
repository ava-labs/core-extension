import {
  createLiveDelegate,
  getCapabilitySignature,
} from './createLiveDelegate';

describe('createLiveDelegate', () => {
  it('resolves methods against the latest value', async () => {
    const ref = { current: { sign: jest.fn().mockResolvedValue('first') } };
    const delegate = createLiveDelegate(() => ref.current);

    expect(await delegate.sign()).toBe('first');

    const next = jest.fn().mockResolvedValue('second');
    ref.current = { sign: next };

    expect(await delegate.sign()).toBe('second');
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('keeps using the latest value after being spread', () => {
    const ref = { current: { a: () => 1, b: () => 2 } };
    const spread = { ...createLiveDelegate(() => ref.current) };

    ref.current = { a: () => 10, b: () => 20 };

    expect(Object.keys(spread)).toEqual(['a', 'b']);
    expect(spread.a()).toBe(10);
    expect(spread.b()).toBe(20);
  });

  it('covers prototype methods and calls them on the latest instance', () => {
    class Provider {
      constructor(private readonly id: number) {}
      getId() {
        return this.id;
      }
    }
    const ref = { current: new Provider(1) };
    const delegate = createLiveDelegate(() => ref.current);

    expect(delegate.getId()).toBe(1);

    ref.current = new Provider(2);

    expect(delegate.getId()).toBe(2);
  });

  it('throws a clear error when the latest value lacks the method', () => {
    const ref: { current: { signBatch?: () => string } } = {
      current: { signBatch: () => 'ok' },
    };
    const delegate = createLiveDelegate(() => ref.current);

    ref.current = {};

    expect(() => delegate.signBatch?.()).toThrow('"signBatch" is no longer');
  });

  it('builds a sorted signature from function members only', () => {
    expect(
      getCapabilitySignature({ b: () => 1, a: () => 2, c: 3 } as object),
    ).toBe('a,b');
    expect(getCapabilitySignature(null)).toBe('');
  });
});
