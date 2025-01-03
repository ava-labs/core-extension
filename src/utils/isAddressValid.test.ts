import { isValidPvmAddress } from './isAddressValid';
import { utils } from '@avalabs/avalanchejs';

describe('src/utils/isAddressValid.ts', () => {
  const address = utils.formatBech32('test', new Uint8Array(2));
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('isValidPvmAddress', () => {
    it('should return false if not valid', async () => {
      const result = isValidPvmAddress(`P-testAddress}`);
      expect(result).toEqual(false);
    });
    it('should return true if valid', async () => {
      const result = isValidPvmAddress(`P-${address}`);
      expect(result).toEqual(true);
    });
  });
});
