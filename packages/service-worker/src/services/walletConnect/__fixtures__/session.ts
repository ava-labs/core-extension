export const mockedSession = {
  topic: '92561a7040fc2c2e1476ab157907e3468c6d9d421b8e4c359fefb00df52e21c2',
  relay: {
    protocol: 'irn',
  },
  expiry: 1692091880,
  namespaces: {
    eip155: {
      accounts: [
        'eip155:43114:0xdDd288FAe290d498B9513f4BAc4a8Fc9a3Ce112d',
        'eip155:43113:0xdDd288FAe290d498B9513f4BAc4a8Fc9a3Ce112d',
        'eip155:1:0xdDd288FAe290d498B9513f4BAc4a8Fc9a3Ce112d',
        'eip155:5:0xdDd288FAe290d498B9513f4BAc4a8Fc9a3Ce112d',
      ],
      methods: [
        'eth_sendTransaction',
        'eth_signTypedData_v3',
        'eth_signTypedData_v4',
        'eth_signTypedData_v1',
        'eth_signTypedData',
        'personal_sign',
        'eth_sign',
        'wallet_addEthereumChain',
        'wallet_switchEthereumChain',
      ],
      events: ['chainChanged', 'accountsChanged'],
    },
  },
  acknowledged: true,
  requiredNamespaces: {
    eip155: {
      methods: [
        'eth_sendTransaction',
        'eth_signTypedData_v3',
        'eth_signTypedData_v4',
        'eth_signTypedData_v1',
        'eth_signTypedData',
        'eth_sign',
        'personal_sign',
      ],
      events: ['chainChanged', 'accountsChanged'],
      chains: ['eip155:43114', 'eip155:43113', 'eip155:1', 'eip155:5'],
    },
  },
  controller:
    'b071c2606b3dc1d05a67c05bc5368154e40d7b11ce4ff5078942663dbd47641b',
  self: {
    publicKey:
      'ed48e84b30448a3e35ef16e0bd95ea8ab5ecae5e36925556733d41a7a120bb76',
    metadata: {
      name: 'Core | Crypto Wallet & NFT Extension',
      url: 'chrome-extension://kpplknndbcfjlkoihffablngecoiffil',
      description: 'The Best Way to Connect to Crypto',
      icons: ['https://extension.core.app/apple-touch-icon.png'],
    },
  },
  peer: {
    publicKey:
      'b071c2606b3dc1d05a67c05bc5368154e40d7b11ce4ff5078942663dbd47641b',
    metadata: {
      name: 'Core',
      description: 'Core Mobile',
      url: 'https://www.avax.network',
      icons: [
        'https://assets.website-files.com/5fec984ac113c1d4eec8f1ef/62602f568fb4677b559827e5_core.jpg',
      ],
      walletId: 'c3de833a-9cb0-4274-bb52-86e402ecfcd3',
    },
  },
};
