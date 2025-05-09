import { correctAddressByPrefix } from './correctAddressByPrefix';

describe('src/pages/Send/utils/correctAddressByPrefix', () => {
  it('should add the prefix when the address does not start with that', () => {
    const address = 'address';
    expect(correctAddressByPrefix(address, 'PREFIX-')).toBe(
      `PREFIX-${address}`,
    );
  });
  it('sgould not duplicate the prefix when it is the start of the address', () => {
    const address = 'PREFIX-address';
    expect(correctAddressByPrefix(address, 'PREFIX-')).toBe(address);
  });
});
