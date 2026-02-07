import { isEvmDerivationPath, isAvalancheDerivationPath } from './secrets';

describe('isEvmDerivationPath', () => {
  it('returns true for EVM derivation paths', () => {
    // Arrange - both with and without m/ prefix (Keystone QR omits the prefix)
    const evmPaths = [
      "m/44'/60'/0'",
      "m/44'/60'/5'",
      "44'/60'/0'",
      "44'/60'/5'",
    ];

    // Act & Assert
    evmPaths.forEach((path) => {
      expect(isEvmDerivationPath(path)).toBe(true);
    });
  });

  it('returns false for Avalanche derivation paths', () => {
    // Arrange
    const avalanchePath = "m/44'/9000'/0'";

    // Act
    const result = isEvmDerivationPath(avalanchePath);

    // Assert
    expect(result).toBe(false);
  });

  it('returns false for other derivation paths', () => {
    // Arrange
    const otherPaths = [
      "m/44'/0'/0'", // BTC
      "m/44'/501'/0'", // Solana
    ];

    // Act & Assert
    otherPaths.forEach((path) => {
      expect(isEvmDerivationPath(path)).toBe(false);
    });
  });

  it('returns false for similar but incorrect coin types', () => {
    // Arrange - paths that look similar to EVM but have wrong coin type
    const similarPaths = [
      "m/44'/600'/0'", // 600 not 60
      "m/44'/6'/0'", // 6 not 60
    ];

    // Act & Assert
    similarPaths.forEach((path) => {
      expect(isEvmDerivationPath(path)).toBe(false);
    });
  });
});

describe('isAvalancheDerivationPath', () => {
  it('returns true for Avalanche X/P derivation paths', () => {
    // Arrange - both with and without m/ prefix (Keystone QR omits the prefix)
    const avalanchePaths = [
      "m/44'/9000'/0'",
      "m/44'/9000'/5'",
      "44'/9000'/0'",
      "44'/9000'/5'",
    ];

    // Act & Assert
    avalanchePaths.forEach((path) => {
      expect(isAvalancheDerivationPath(path)).toBe(true);
    });
  });

  it('returns false for EVM derivation paths', () => {
    // Arrange
    const evmPath = "m/44'/60'/0'";

    // Act
    const result = isAvalancheDerivationPath(evmPath);

    // Assert
    expect(result).toBe(false);
  });

  it('returns false for other derivation paths', () => {
    // Arrange
    const otherPaths = [
      "m/44'/0'/0'", // BTC
      "m/44'/501'/0'", // Solana
    ];

    // Act & Assert
    otherPaths.forEach((path) => {
      expect(isAvalancheDerivationPath(path)).toBe(false);
    });
  });

  it('returns false for similar but incorrect coin types', () => {
    // Arrange - paths that look similar to Avalanche but have wrong coin type
    const similarPaths = [
      "m/44'/90000'/0'", // 90000 not 9000
      "m/44'/900'/0'", // 900 not 9000
    ];

    // Act & Assert
    similarPaths.forEach((path) => {
      expect(isAvalancheDerivationPath(path)).toBe(false);
    });
  });
});
