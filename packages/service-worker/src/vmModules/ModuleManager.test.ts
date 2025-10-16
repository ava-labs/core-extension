import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { ModuleManager } from './ModuleManager';
import { VMModuleError } from '@core/types';
import { ApprovalController } from './ApprovalController';

jest.mock('@avalabs/bitcoin-module', () => {
  return {
    BitcoinModule: jest.fn().mockImplementation(() => {
      return {
        getManifest: jest.fn().mockReturnValue({
          name: 'bitcoin',
          network: {
            chainIds: [],
            namespaces: ['bip122'],
          },
          permissions: {
            rpc: {
              methods: ['bitcoin_*'],
            },
          },
        }),
      };
    }),
  };
});
jest.mock('@avalabs/evm-module', () => {
  return {
    EvmModule: jest.fn().mockImplementation(() => {
      return {
        getManifest: jest.fn().mockReturnValue({
          name: 'evm',
          network: {
            chainIds: ['eip155:1'],
            namespaces: [],
          },
          permissions: {
            rpc: {
              methods: ['eth_*'],
            },
          },
        }),
      };
    }),
  };
});
jest.mock('@avalabs/avalanche-module', () => {
  return {
    AvalancheModule: jest.fn().mockImplementation(() => {
      return {
        getManifest: jest.fn().mockReturnValue({
          name: 'avm',
          network: {
            chainIds: [],
            namespaces: ['avax'],
          },
          permissions: {
            rpc: {
              methods: ['avalanche_*'],
            },
          },
        }),
      };
    }),
  };
});
jest.mock('@avalabs/hvm-module', () => {
  return {
    HvmModule: jest.fn().mockImplementation(() => {
      return {
        getManifest: jest.fn().mockReturnValue({
          name: 'hvm',
          network: {
            chainIds: [],
            namespaces: ['hvm'],
          },
          permissions: {
            rpc: {
              methods: ['hvm_signTransaction'],
            },
          },
        }),
      };
    }),
  };
});
jest.mock('@avalabs/svm-module', () => {
  return {
    SvmModule: jest.fn().mockImplementation(() => {
      return {
        getManifest: jest.fn().mockReturnValue({
          name: 'svm',
          network: {
            chainIds: [],
            namespaces: ['solana'],
          },
          permissions: {
            rpc: {
              methods: ['solana_*'],
            },
          },
        }),
      };
    }),
  };
});

describe('ModuleManager', () => {
  let manager: ModuleManager;
  let controller: ApprovalController;

  beforeEach(() => {
    controller = {
      requestApproval: jest.fn(),
    } as any;
    manager = new ModuleManager(controller);
  });
  describe('when not initialized', () => {
    it('should throw not initialized error', async () => {
      try {
        await manager.loadModule('eip155:123', 'eth_randomMethod');
      } catch (e: any) {
        expect(e.data.reason).toBe(VMModuleError.ModulesNotInitialized);
      }
    });
  });

  describe('when initialized', () => {
    beforeEach(async () => {
      await manager.activate();
    });

    it('should load the correct modules', async () => {
      const params = [
        {
          chainId: 'bip122:000000000019d6689c085ae165831e93',
          method: 'bitcoin_signTransaction',
          name: NetworkVMType.BITCOIN,
        },
        {
          chainId: 'bip122:123123123',
          method: 'bitcoin_sendTransaction',
          name: NetworkVMType.BITCOIN,
        },
        {
          chainId: 'eip155:1',
          method: 'eth_sendTransaction',
          name: NetworkVMType.EVM,
        },
        {
          chainId: 'avax:1123',
          method: 'avalanche_sendTransaction',
          name: NetworkVMType.AVM,
        },
        {
          chainId: 'hvm:1123',
          method: 'hvm_signTransaction',
          name: NetworkVMType.HVM,
        },
        {
          chainId: 'solana:mainnet',
          method: 'solana_signTransaction',
          name: NetworkVMType.SVM,
        },
      ];

      await Promise.all(
        params.map(async (param) => {
          const module = await manager.loadModule(param.chainId, param.method);
          expect(module?.getManifest()?.name.toLowerCase()).toContain(
            param.name.toLowerCase(),
          );
        }),
      );
    });

    it('should have thrown with incorrect chainId', async () => {
      try {
        await manager.loadModule('eip155:123', 'eth_randomMethod');
      } catch (e: any) {
        expect(e.data.reason).toBe(VMModuleError.UnsupportedChain);
      }
    });

    it('should have thrown with incorrect method', async () => {
      try {
        await manager.loadModule('eip155:1', 'evth_randomMethod');
      } catch (e: any) {
        expect(e.data.reason).toBe(VMModuleError.UnsupportedMethod);
      }
    });

    it('should have thrown with incorrect namespace', async () => {
      try {
        await manager.loadModule('avalanche:1', 'eth_method');
      } catch (e: any) {
        expect(e.data.reason).toBe(VMModuleError.UnsupportedNamespace);
      }
    });
  });
});
