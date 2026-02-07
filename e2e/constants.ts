/**
 * Test configuration constants
 */
export const TEST_CONFIG = {
  extension: {
    path: '../dist',
    userDataDir: './test-results/user-data',
    // Extension ID is derived from the extension's key in manifest.json
    // This is consistent across builds and environments
    id: 'kgoihbeifdgeehmjjapgdgdlghbajemb',
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
  'invalidword',
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
    avalancheCChain: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  },
  FULL: {
    name: 'Full Contact',
    avalancheCChain: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    avalancheXP: 'avax1qm2a25eytsrj235hxg6jc0mwk99tss64eqevsw',
    bitcoin: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    solana: '7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV',
  },
  SECONDARY: {
    name: 'Secondary Contact',
    avalancheCChain: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
  },
  SEARCH: {
    name: 'Searchable Contact',
    avalancheCChain: '0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8',
  },
};
