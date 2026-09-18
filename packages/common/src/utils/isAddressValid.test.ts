import { isValidPvmAddress, isValidXPAddress } from './isAddressValid';
import { utils } from '@avalabs/avalanchejs';

describe('src/utils/isAddressValid.ts', () => {
  const mainnetAddress = utils.formatBech32('avax', new Uint8Array(2));
  const fujiAddress = utils.formatBech32('fuji', new Uint8Array(2));
  const localAddress = utils.formatBech32('local', new Uint8Array(2));

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('isValidPvmAddress', () => {
    it('should return false if not valid bech32', async () => {
      expect(isValidPvmAddress(`P-testAddress}`, false)).toEqual(false);
      expect(isValidPvmAddress(`P-testAddress}`, true)).toEqual(false);
    });

    it('should accept a mainnet address on mainnet', async () => {
      expect(isValidPvmAddress(`P-${mainnetAddress}`, false)).toEqual(true);
    });

    // Check that testnet addresses are rejected on mainnet, and that mainnet addresses are rejected on testnet.
    it('should reject a testnet address on mainnet', async () => {
      expect(isValidPvmAddress(`P-${fujiAddress}`, false)).toEqual(false);
      expect(isValidPvmAddress(`P-${localAddress}`, false)).toEqual(false);
    });

    it('should reject a mainnet address on testnet', async () => {
      expect(isValidPvmAddress(`P-${mainnetAddress}`, true)).toEqual(false);
    });

    it('should accept non-mainnet HRPs on testnet, incl. local/custom networks', async () => {
      expect(isValidPvmAddress(`P-${fujiAddress}`, true)).toEqual(true);
      expect(isValidPvmAddress(`P-${localAddress}`, true)).toEqual(true);
    });
  });

  describe('isValidXPAddress', () => {
    it('should be network-agnostic (for address book entries)', async () => {
      expect(isValidXPAddress(mainnetAddress)).toEqual(true);
      expect(isValidXPAddress(fujiAddress)).toEqual(true);
      expect(isValidXPAddress('not-an-address')).toEqual(false);
    });
  });
});
