import { AvalancheModule } from '@avalabs/avalanche-module';
import { BitcoinModule } from '@avalabs/bitcoin-module';
import { EvmModule } from '@avalabs/evm-module';
import { HvmModule } from '@avalabs/hvm-module';
import { SvmModule } from '@avalabs/svm-module';
import {
  AppInfo,
  AppName,
  BatchApprovalController,
  Environment,
  Module,
} from '@avalabs/vm-module-types';
import { ethErrors } from 'eth-rpc-errors';
import { singleton } from 'tsyringe';
import { runtime } from 'webextension-polyfill';

import {
  assertPresent,
  AvaxCaipId,
  AvaxLegacyCaipId,
  BitcoinCaipId,
  isDevelopment,
} from '@core/common';
import { NetworkWithCaipId, VMModuleError } from '@core/types';
import { ApprovalController } from './ApprovalController';
import { circuitBreakerFetch } from './utils';

// https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-2.md
// Syntax for namespace is defined in CAIP-2
const NAMESPACE_REGEX = new RegExp('^[-a-z0-9]{3,8}$');

@singleton()
export class ModuleManager {
  #_modules: Module[] | undefined;
  #approvalController: BatchApprovalController;

  isNonRestrictedMethod(module: Module, method: string): boolean {
    const nonRestrictedMethods =
      module.getManifest()?.permissions.rpc.nonRestrictedMethods;

    if (nonRestrictedMethods === undefined) {
      return false;
    }

    return nonRestrictedMethods.includes(method);
  }

  get #modules(): Module[] {
    assertPresent(this.#_modules, VMModuleError.ModulesNotInitialized);

    return this.#_modules;
  }

  set #modules(modules: Module[]) {
    this.#_modules = modules;
  }

  get modules(): Module[] {
    return this.#modules;
  }

  constructor(controller: ApprovalController) {
    this.#approvalController = controller;
  }

  async activate(): Promise<void> {
    if (this.#_modules !== undefined) return;

    const environment = isDevelopment()
      ? Environment.DEV
      : Environment.PRODUCTION;

    const appInfo: AppInfo = {
      name: AppName.CORE_EXTENSION,
      version: runtime.getManifest().version,
    };

    this.#modules = [
      new EvmModule({
        environment,
        approvalController: this.#approvalController,
        appInfo,
        runtime: { fetch: circuitBreakerFetch },
      }),
      new AvalancheModule({
        environment,
        approvalController: this.#approvalController,
        appInfo,
        runtime: { fetch: circuitBreakerFetch },
      }),
      new BitcoinModule({
        environment,
        approvalController: this.#approvalController,
        appInfo,
        runtime: { fetch: circuitBreakerFetch },
      }),
      new HvmModule({
        environment,
        approvalController: this.#approvalController,
        appInfo,
        runtime: { fetch: circuitBreakerFetch },
      }),
      new SvmModule({
        environment,
        approvalController: this.#approvalController,
        appInfo,
        runtime: { fetch: circuitBreakerFetch },
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
    method?: string,
  ): Promise<Module> {
    return this.loadModule(network.caipId, method);
  }

  async #getModule(chainIdOrScope: string): Promise<Module | undefined> {
    const scopeConversion =
      BitcoinCaipId[chainIdOrScope] ??
      AvaxCaipId[chainIdOrScope] ??
      AvaxLegacyCaipId[chainIdOrScope] ??
      chainIdOrScope;

    const [namespace] = scopeConversion.split(':');
    if (!namespace || !NAMESPACE_REGEX.test(namespace)) {
      throw ethErrors.rpc.invalidParams({
        data: {
          reason: VMModuleError.UnsupportedNamespace,
          namespace,
        },
      });
    }
    return (
      (await this.#getModuleByChainId(chainIdOrScope)) ??
      (await this.#getModuleByNamespace(namespace))
    );
  }

  async #getModuleByChainId(chainId: string): Promise<Module | undefined> {
    return this.#modules.find((module) =>
      module.getManifest()?.network.chainIds.includes(chainId),
    );
  }

  async #getModuleByNamespace(namespace: string): Promise<Module | undefined> {
    return this.#modules.find((module) =>
      module.getManifest()?.network.namespaces.includes(namespace),
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
