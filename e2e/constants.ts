/**
 * Test configuration constants
 */
export const TEST_CONFIG = {
  extension: {
    path: '../dist',
    userDataDir: './test-results/user-data',
  },
  wallet: {
    snapshotName: 'mainnetPrimaryExtWallet',
    password: process.env.WALLET_PASSWORD || 'TestPassword123!',
    recoveryPhrase12: process.env.RECOVERY_PHRASE_12_WORDS?.split(' ') || [],
    recoveryPhrase24: process.env.RECOVERY_PHRASE_24_WORDS?.split(' ') || [],
  },
  timeouts: {
    short: 5000,
    medium: 10000,
    long: 30000,
    navigation: 60000,
  },
  snapshots: {
    mainnet: 'mainnetPrimaryExtWallet',
    testnet: 'testnetPrimaryExtWallet',
  },
};

/**
 * Test tags for filtering
 */
export const TEST_TAGS = {
  SMOKE: '@smoke',
  REGRESSION: '@regression',
  WALLET: '@wallet',
  ONBOARDING: '@onboarding',
  CONTACTS: '@contacts',
  SEND: '@send',
  SWAP: '@swap',
  SETTINGS: '@settings',
};

/**
 * Invalid recovery phrase for testing error states
 */
export const INVALID_RECOVERY_PHRASE_12 = [
  'abandon',
  'abandon',
  'abandon',
  'abandon',
  'abandon',
  'abandon',
  'abandon',
  'abandon',
  'abandon',
  'abandon',
  'abandon',
  'about',
];

/**
 * Test wallet names
 */
export const TEST_WALLET_NAMES = {
  DEFAULT: 'Test Wallet',
  RECOVERY_12: 'Recovery 12 Wallet',
  RECOVERY_24: 'Recovery 24 Wallet',
  MANUAL: 'Manual Wallet',
};

/**
 * Contact data for testing
 */
export const TEST_CONTACTS = {
  VALID: {
    name: 'Test Contact',
    avalancheCChain: '0x1234567890123456789012345678901234567890',
    avalancheXP:
      'avax1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq',
    bitcoin: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    solana: '11111111111111111111111111111111',
  },
  SECONDARY: {
    name: 'Secondary Contact',
    avalancheCChain: '0x0987654321098765432109876543210987654321',
  },
  SEARCH: {
    name: 'Searchable Contact',
    avalancheCChain: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
  },
};
