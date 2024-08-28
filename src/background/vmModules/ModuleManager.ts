import { Environment, Module } from '@avalabs/vm-module-types';
import { BitcoinModule } from '@avalabs/bitcoin-module';
import { ethErrors } from 'eth-rpc-errors';

import { assertPresent } from '@src/utils/assertions';
import { isDevelopment } from '@src/utils/environment';

import { NetworkWithCaipId } from '../services/network/models';
import { type WalletService } from '../services/wallet/WalletService';

import { VMModuleError } from './models';
import getController from './ApprovalController';

// https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-2.md
// Syntax for namespace is defined in CAIP-2
const NAMESPACE_REGEX = new RegExp('^[-a-z0-9]{3,8}$');

class ModuleManager {
  #_modules: Module[] | undefined;

  get #modules(): Module[] {
    assertPresent(this.#_modules, VMModuleError.ModulesNotInitialized);

    return this.#_modules;
  }

  set #modules(modules: Module[]) {
    this.#_modules = modules;
  }

  async init(walletService: WalletService): Promise<void> {
    if (this.#_modules !== undefined) return;

    const environment = isDevelopment()
      ? Environment.DEV
      : Environment.PRODUCTION;

    this.#modules = [
      new BitcoinModule({
        environment,
        approvalController: getController(walletService),
      }),
    ];
  }

  async loadModule(caipId: string, method?: string): Promise<Module> {
    const module = await this.#getModule(caipId);

    if (module === undefined) {
      throw ethErrors.rpc.invalidParams({
        data: {
          reason: VMModuleError.UnsupportedChain,
          caipId,
        },
      });
    }

    if (method && !this.#isMethodPermitted(module, method)) {
      throw ethErrors.rpc.invalidParams({
        data: {
          reason: VMModuleError.UnsupportedMethod,
          method,
        },
      });
    }

    return module;
  }

  async loadModuleByNetwork(
    network: NetworkWithCaipId,
    method?: string
  ): Promise<Module> {
    return this.loadModule(network.caipId, method);
  }

  async #getModule(chainId: string): Promise<Module | undefined> {
    const [namespace] = chainId.split(':');

    if (!namespace || !NAMESPACE_REGEX.test(namespace)) {
      throw ethErrors.rpc.invalidParams({
        data: {
          reason: VMModuleError.UnsupportedNamespace,
          namespace,
        },
      });
    }

    return (
      (await this.#getModuleByChainId(chainId)) ??
      (await this.#getModuleByNamespace(namespace))
    );
  }

  async #getModuleByChainId(chainId: string): Promise<Module | undefined> {
    return this.#modules.find((module) =>
      module.getManifest()?.network.chainIds.includes(chainId)
    );
  }

  async #getModuleByNamespace(namespace: string): Promise<Module | undefined> {
    return this.#modules.find((module) =>
      module.getManifest()?.network.namespaces.includes(namespace)
    );
  }

  #isMethodPermitted(module: Module, method: string): boolean {
    const methods = module.getManifest()?.permissions.rpc.methods;

    if (methods === undefined) {
      return false;
    }

    return methods.some((m) => {
      if (m === method) {
        return true;
      }
      if (m.endsWith('*')) {
        return method.startsWith(m.slice(0, -1));
      }
    });
  }
}

export default new ModuleManager();
