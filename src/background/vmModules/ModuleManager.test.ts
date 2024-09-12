import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { ModuleManager } from './ModuleManager';
import { VMModuleError } from './models';
import { ApprovalController } from './ApprovalController';
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
          method: 'bitcoin_sendTransaction',
          name: NetworkVMType.BITCOIN,
        },
      ];

      await Promise.all(
        params.map(async (param) => {
          const module = await manager.loadModule(param.chainId, param.method);
          expect(module?.getManifest()?.name.toLowerCase()).toContain(
            param.name.toLowerCase()
          );
        })
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
