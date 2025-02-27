import { pick } from 'lodash';
import { singleton } from 'tsyringe';
import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { Module, NetworkVMType } from '@avalabs/vm-module-types';

import type { ModuleManager } from '@src/background/vmModules/ModuleManager';
import { PickKeys } from '@src/background/models';
import { CommonError, SecretsError } from '@src/utils/errors';
import { assertPresent } from '@src/utils/assertions';

import { NetworkWithCaipId } from '../network/models';
import { NetworkService } from '../network/NetworkService';
import { emptyAddresses, emptyDerivationPaths } from './utils';
import { SecretsService } from './SecretsService';
import { DerivationPathsMap, SecretType } from './models';

@singleton()
export class AddressResolver {
  #moduleManager?: ModuleManager;

  constructor(
    private readonly networkService: NetworkService,
    private readonly secretsService: SecretsService,
  ) {}

  init(moduleManager: ModuleManager) {
    this.#moduleManager = moduleManager;
  }

  async #getNetworksForAddressDerivation(): Promise<NetworkWithCaipId[]> {
    return Object.values(await this.networkService.activeNetworks.promisify());
  }

  async getDerivationPathsByVM<VMs extends (keyof DerivationPathsMap)[]>(
    accountIndex: number,
    derivationPathType: DerivationPath,
    vms: VMs,
  ): Promise<PickKeys<DerivationPathsMap, VMs>> {
    assertPresent(this.#moduleManager, CommonError.ModuleManagerNotSet);

    const derivationPaths = emptyDerivationPaths();

    for (const module of this.#moduleManager.modules) {
      const modulePaths = await module.buildDerivationPath({
        accountIndex,
        derivationPathType,
      });

      for (const [vmType, address] of Object.entries(modulePaths)) {
        derivationPaths[vmType] = address;
      }
    }

    for (const vm of vms) {
      assertPresent(
        derivationPaths[vm],
        SecretsError.DerivationPathMissing,
        vm,
      );
    }

    return pick(derivationPaths, vms) as PickKeys<DerivationPathsMap, VMs>;
  }

  async getAddressesForSecretId(
    secretId: string,
    accountIndex?: number,
    derivationPathType?: DerivationPath,
  ): Promise<Record<NetworkVMType, string> | never> {
    assertPresent(this.#moduleManager, CommonError.ModuleManagerNotSet);

    const secrets = await this.secretsService.getSecretsById(secretId);
    const addresses = emptyAddresses();

    if (secrets.secretType === SecretType.Fireblocks) {
      return {
        ...addresses,
        [NetworkVMType.EVM]: secrets.addresses.addressC,
        [NetworkVMType.BITCOIN]: secrets.addresses.addressBTC ?? '',
      };
    } else if (secrets.secretType === SecretType.WalletConnect) {
      return {
        ...addresses,
        [NetworkVMType.EVM]: secrets.addresses.addressC,
        [NetworkVMType.AVM]: secrets.addresses.addressAVM ?? '',
        [NetworkVMType.PVM]: secrets.addresses.addressPVM ?? '',
        [NetworkVMType.BITCOIN]: secrets.addresses.addressBTC ?? '',
        [NetworkVMType.CoreEth]: secrets.addresses.addressCoreEth ?? '',
      };
    }

    const activeNetworks = await this.#getNetworksForAddressDerivation();
    const modules = new Map<Module, NetworkWithCaipId>();

    for (const network of activeNetworks) {
      const module = await this.#moduleManager.loadModuleByNetwork(network);
      if (module && !modules.has(module)) {
        modules.set(module, network);
      }
    }

    for (const [module, network] of modules.entries()) {
      const moduleAddresses = await module
        .deriveAddress({
          accountIndex,
          network,
          secretId,
          derivationPathType,
        })
        .catch((error) => {
          console.error(
            `Failed to derive address for account ${accountIndex} and ${network.caipId}`,
            error,
          );

          // We don't want to completely fail the entire method -- we return all the addresses we could.
          // The responsibility for validating the presence of required addresses lies with the caller.
          return {};
        });

      for (const [vmType, address] of Object.entries(moduleAddresses)) {
        addresses[vmType] = address;
      }
    }

    return addresses;
  }
}
