import { NetworkVMType } from '@avalabs/core-chains-sdk';

import ModuleManager from './ModuleManager';
import { VMModuleError } from './models';

describe('ModuleManager', () => {
  describe('when not initialized', () => {
    it('should throw not initialized error', async () => {
      try {
        await ModuleManager.loadModule('eip155:123', 'eth_randomMethod');
      } catch (e: any) {
        expect(e.data.reason).toBe(VMModuleError.ModulesNotInitialized);
      }
    });
  });

  describe('when initialized', () => {
    beforeEach(async () => {
      await ModuleManager.init();
    });

    it('should load the correct modules', async () => {
      const params = [
        {
          chainId: 'eip155:1',
          method: 'eth_randomMethod',
          name: NetworkVMType.EVM,
        },
        {
          chainId: 'bip122:000000000019d6689c085ae165831e93',
          method: 'bitcoin_sendTransaction',
          name: NetworkVMType.BITCOIN,
        },
        {
          chainId: 'avax:2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM',
          method: 'avalanche_randomMethod',
          name: NetworkVMType.AVM,
        },
        {
          chainId: 'avax:11111111111111111111111111111111LpoYY',
          method: 'avalanche_randomMethod',
          name: NetworkVMType.PVM,
        },
        {
          chainId: 'eip2256:1',
          method: 'eth_randomMethod',
          name: NetworkVMType.CoreEth,
        },
      ];

      await Promise.all(
        params.map(async (param) => {
          const module = await ModuleManager.loadModule(
            param.chainId,
            param.method
          );
          expect(module?.getManifest()?.name.toLowerCase()).toContain(
            param.name.toLowerCase()
          );
        })
      );
    });

    it('should have thrown with incorrect chainId', async () => {
      try {
        await ModuleManager.loadModule('eip155:123', 'eth_randomMethod');
      } catch (e: any) {
        expect(e.data.reason).toBe(VMModuleError.UnsupportedChain);
      }
    });

    it('should have thrown with incorrect method', async () => {
      try {
        await ModuleManager.loadModule('eip155:1', 'evth_randomMethod');
      } catch (e: any) {
        expect(e.data.reason).toBe(VMModuleError.UnsupportedMethod);
      }
    });

    it('should have thrown with incorrect namespace', async () => {
      try {
        await ModuleManager.loadModule('avalanche:1', 'eth_method');
      } catch (e: any) {
        expect(e.data.reason).toBe(VMModuleError.UnsupportedNamespace);
      }
    });
  });
});
