export const TEST_CONFIG = {
  extension: {
    // Path to built extension (relative to this directory)
    path: process.env.EXTENSION_PATH || './dist',
    // User data directory for browser profile
    userDataDir: './user-data-dir',
    // Extension ID (will be auto-detected if not provided)
    id: process.env.EXTENSION_ID || '',
  },
  wallet: {
    password: (() => {
      if (!process.env.WALLET_PASSWORD) {
        throw new Error('WALLET_PASSWORD must be set in .env file. See .env.example for template.');
      }
      return process.env.WALLET_PASSWORD;
    })(),
    recoveryPhrase: process.env.WALLET_RECOVERY_PHRASE || 'test test test test test test test test test test test junk',
    recoveryPhrase12Words: (() => {
      if (!process.env.RECOVERY_PHRASE_12_WORDS) {
        throw new Error('RECOVERY_PHRASE_12_WORDS must be set in .env file. See .env.example for template.');
      }
      return process.env.RECOVERY_PHRASE_12_WORDS;
    })(),
    recoveryPhrase24Words: (() => {
      if (!process.env.RECOVERY_PHRASE_24_WORDS) {
        throw new Error('RECOVERY_PHRASE_24_WORDS must be set in .env file. See .env.example for template.');
      }
      return process.env.RECOVERY_PHRASE_24_WORDS;
    })(),
    // Timeouts for wallet operations
    timeouts: {
      connect: 15000,
      action: 15000,
      navigation: 15000,
      unlock: 10000,
    },
  },
  timeouts: {
    default: 30000,
    extended: 60000,
    short: 5000,
  },
  testData: {
    // Test wallet addresses (C-Chain format)
    addresses: {
      primary: '0x0000000000000000000000000000000000000000',
      secondary: '0x1111111111111111111111111111111111111111',
    },
    // Test contact information
    contacts: {
      testContact: {
        name: 'Test Contact',
        address: '0x2222222222222222222222222222222222222222',
      },
      contact1: {
        name: 'Alice Crypto',
        avalancheCChain: '0xf5d2d2f8e3703C928c08af3F1f9C4692D7ab98C2',
        avalancheXP: 'avax1p9d7lu6xw27ld20pj9ru8a8233a8radu4ad4tk',
        bitcoin: 'bc1qgu8k0cs0jc928e39qgj87guk6ql3ahssap24fs',
        solana: '3yTtm6Cp5x7ppKrXtjt19fxpT4Qj1f18R25eYWjaP6GH',
      },
      contact2: {
        name: 'Bob Blockchain',
        avalancheCChain: '0x5D2aeFc98240C42456B4C237713AdA32E51bcba7',
        avalancheXP: 'avax184g8ffhl0a9dej4wjjpz8dw8x977f9slg9uknd',
        bitcoin: 'bc1q9pxl5qagt0glrgvuajjvu8vczky3ttxcv5nz4w',
        solana: '73SxxYPdyw1qAMDq8gZmxEku17JAmQEJd17xr3ij8eh1',
      },
    },
    // Test amounts
    amounts: {
      small: '0.001',
      medium: '0.1',
      large: '1',
    },
  },
};

export const NETWORK_CONFIG = {
  avalanche: {
    mainnet: {
      chainId: 43114,
      rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
      explorerUrl: 'https://snowtrace.io',
    },
    testnet: {
      chainId: 43113,
      rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
      explorerUrl: 'https://testnet.snowtrace.io',
    },
  },
};

export const ELEMENT_TIMEOUTS = {
  // How long to wait for elements to appear
  visible: 10000,
  // How long to wait for elements to disappear
  hidden: 5000,
  // How long to wait for navigation
  navigation: 30000,
};

export const TEST_TAGS = {
  SMOKE: '@smoke',
  REGRESSION: '@regression',
};
