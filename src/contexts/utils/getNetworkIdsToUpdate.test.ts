import { getNetworkIdsToUpdate } from './getNetworkIdsToUpdate';

describe('contexts/utils/getNetworkIdsToUpdate', () => {
  it('handles empty network lists', () => {
    expect(getNetworkIdsToUpdate([], 0, 10)).toEqual([]);
    expect(getNetworkIdsToUpdate([], 1, 0)).toEqual([]);
    expect(getNetworkIdsToUpdate([], 100, 1)).toEqual([]);
  });

  it('returns network items when they fit the update period', () => {
    const networks = [1, 2, 3, 4, 5];
    expect(getNetworkIdsToUpdate(networks, 0, 10)).toEqual([1]);
    expect(getNetworkIdsToUpdate(networks, 3, 10)).toEqual([4]);
    // when having 10 iteration window, we do 5 updates and 5 waits
    expect(getNetworkIdsToUpdate(networks, 5, 10)).toEqual([]);
    // then start again
    expect(getNetworkIdsToUpdate(networks, 10, 10)).toEqual([1]);
  });

  it(`returns network items when they don't fit the update period`, () => {
    const networks = [1, 2, 3, 4, 5, 6, 7];
    expect(getNetworkIdsToUpdate(networks, 0, 5)).toEqual([1, 2]);
    expect(getNetworkIdsToUpdate(networks, 1, 5)).toEqual([3, 4]);
    expect(getNetworkIdsToUpdate(networks, 2, 5)).toEqual([5, 6]);
    expect(getNetworkIdsToUpdate(networks, 3, 5)).toEqual([7]);
    expect(getNetworkIdsToUpdate(networks, 4, 5)).toEqual([]);
    expect(getNetworkIdsToUpdate(networks, 5, 5)).toEqual([1, 2]);
  });
});
