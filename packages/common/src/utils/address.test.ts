import {
  isBase58Address,
  isBase58AddressInNetwork,
  isBech32Address,
  isBech32AddressInNetwork,
} from './address';

// valid
const mainnetAddress = 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq';
const testnetAddress = 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx';

const mainnetP2PKH = '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2';
const testnetP2PKH = 'mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn';
const mainnetP2SH = '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy';
const testnetP2SH = '2MzQwSSnBHWHqSAqtTVQ6v47XtaisrJa1Vc';

// Not valid
const invalidAddress = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t5';

describe('isBech32Address', () => {
  it('Should return true when passing in an valid mainnet address', () => {
    const result = isBech32Address(mainnetAddress);
    expect(result).toBe(true);
  });

  it('Should return false when passing in an valid testnet address', () => {
    const result = isBech32Address(testnetAddress);
    expect(result).toBe(true);
  });

  it('Should return false when passing in an invalid testnet address', () => {
    const result = isBech32Address(invalidAddress);
    expect(result).toBe(false);
  });
});

describe('isBech32AddressInNetwork', () => {
  describe('is Mainnet', () => {
    it('Should return true when passing in an valid mainnet address', () => {
      const result = isBech32AddressInNetwork(mainnetAddress, true);
      expect(result).toBe(true);
    });

    it('Should return false when passing in an valid testnet address', () => {
      const result = isBech32AddressInNetwork(testnetAddress, true);
      expect(result).toBe(false);
    });

    it('Should return false when passing in an address with invalid address', () => {
      const result = isBech32AddressInNetwork(invalidAddress, true);
      expect(result).toBe(false);
    });

    it('Should return true when passing in an valid mainnet address in upper case', () => {
      const result = isBech32AddressInNetwork(
        mainnetAddress.toUpperCase(),
        true,
      );
      expect(result).toBe(true);
    });
  });

  describe('is Testnet', () => {
    it('Should return true when passing in an valid testnet address', () => {
      const result = isBech32AddressInNetwork(testnetAddress, false);
      expect(result).toBe(true);
    });

    it('Should return false when passing in an valid mainnet address', () => {
      const result = isBech32AddressInNetwork(mainnetAddress, false);
      expect(result).toBe(false);
    });

    it('Should return true when passing in an valid testnet address in upper cases', () => {
      const result = isBech32AddressInNetwork(
        testnetAddress.toUpperCase(),
        false,
      );
      expect(result).toBe(true);
    });
  });
});

describe('isBase58Address', function () {
  it('should return true for valid address (P2PKH)', () => {
    expect(isBase58Address(mainnetP2PKH)).toEqual(true);
  });

  it('should return true for valid testnet address (P2PKH)', () => {
    expect(isBase58Address(testnetP2PKH)).toEqual(true);
  });

  it('should return true for valid address (P2SH)', () => {
    expect(isBase58Address(mainnetP2SH)).toEqual(true);
  });

  it('should return true for valid testnet address (P2SH)', () => {
    expect(isBase58Address(testnetP2SH)).toEqual(true);
  });

  it('should return false for invalid address, invalid character in the string', () => {
    expect(isBase58Address('2MzQwSSnBHWHqSAqgTVQ6v47XtaisrJa1Vc')).toEqual(
      false,
    );
  });

  it('should return false for valid mainnet bech32 address', () => {
    expect(isBase58Address(mainnetAddress)).toEqual(false);
  });

  it('should return false for valid testnet bech32 address', () => {
    expect(isBase58Address(testnetAddress)).toEqual(false);
  });

  it('should return false for invalid bech32 address', () => {
    expect(isBase58Address(invalidAddress)).toEqual(false);
  });

  it('should return false for invalid address', () => {
    expect(isBase58Address('1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN')).toEqual(false);
  });
});

describe('isBase58AddressInNetwork', function () {
  it('return true for valid mainnet address (P2PKH)', () => {
    expect(isBase58AddressInNetwork(mainnetP2PKH, true)).toEqual(true);
  });
  it('return true for valid testnet address (P2PKH)', () => {
    expect(isBase58AddressInNetwork(testnetP2PKH, false)).toEqual(true);
  });
  it('return true for valid mainnet address (P2SH)', () => {
    expect(isBase58AddressInNetwork(mainnetP2SH, true)).toEqual(true);
  });
  it('return true for valid testnet address (P2SH)', () => {
    expect(isBase58AddressInNetwork(testnetP2SH, false)).toEqual(true);
  });
  it('return false if address valid but wrong network (P2PKH)', () => {
    expect(isBase58AddressInNetwork(mainnetP2PKH, false)).toEqual(false);
    expect(isBase58AddressInNetwork(testnetP2PKH, true)).toEqual(false);
  });
  it('return false if address valid but wrong network (P2SH)', () => {
    expect(isBase58AddressInNetwork(mainnetP2SH, false)).toEqual(false);
    expect(isBase58AddressInNetwork(testnetP2SH, true)).toEqual(false);
  });
});
