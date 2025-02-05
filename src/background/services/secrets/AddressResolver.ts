import { singleton } from 'tsyringe';
import { Module, NetworkVMType } from '@avalabs/vm-module-types';
import type { ModuleManager } from '@src/background/vmModules/ModuleManager';

import { isDevnet } from '@src/utils/isDevnet';
import { CommonError, SecretsError } from '@src/utils/errors';
import { assertPresent } from '@src/utils/assertions';

import { NetworkWithCaipId } from '../network/models';
import { NetworkService } from '../network/NetworkService';
import { emptyAddresses, emptyDerivationPaths } from './utils';
import { DerivationPath } from '@avalabs/core-wallets-sdk';
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
    const allNetworksForEnv = Object.values(
      await this.networkService.activeNetworks.promisify(),
    );

    /**
     * In some instances (like X- and P-Chain), we may get two conflicting networks
     * in the test environment (e.g. both Fuji P-Chain, and Devnet P-Chain).
     *
     * The two variants would result in conflicting addresses, so we need to filter
     * one of them out, based on whichever is active.
     *
     * TODO: find a nicer way to do it. Ideas:
     *   1) have a 3rd environment (mainnet / testnet / devnet)
     *   2) have separate NetworkVMType for testnets & devnets
     *   3) in the AccountService, do not segregate addresses by NetworkVMType,
     * 			but rather by CAIP-2 ids (whole ID or just namespace and then choose the more specific one)
     */
    const isDevnetOnTheList = allNetworksForEnv.some(isDevnet);

    if (!isDevnetOnTheList) {
      return allNetworksForEnv;
    }

    const isDevnetActive = this.networkService.uiActiveNetwork
      ? isDevnet(this.networkService.uiActiveNetwork)
      : false;

    return allNetworksForEnv.filter((network) => {
      if (
        network.vmName !== NetworkVMType.AVM &&
        network.vmName !== NetworkVMType.PVM
      ) {
        return true;
      }

      return isDevnetActive ? isDevnet(network) : true;
    });
  }

  async getDerivationPaths(
    accountIndex: number,
    derivationPathType: DerivationPath,
  ): Promise<DerivationPathsMap> {
    assertPresent(this.#moduleManager, CommonError.ModuleManagerNotSet);

    const derivationPaths = emptyDerivationPaths();

    const activeNetworks = await this.#getNetworksForAddressDerivation();
    const modules = new Set<Module>();

    for (const network of activeNetworks) {
      const module = await this.#moduleManager.loadModuleByNetwork(network);
      if (module && !modules.has(module)) {
        modules.add(module);
      }
    }

    for (const module of modules) {
      const modulePaths = await module.buildDerivationPath({
        accountIndex,
        derivationPathType,
      });

      for (const [vmType, address] of Object.entries(modulePaths)) {
        derivationPaths[vmType] = address;
      }
    }

    for (const [vmType, path] of Object.entries(derivationPaths)) {
      assertPresent(path, SecretsError.DerivationPathMissing, vmType);
    }

    return derivationPaths;
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
      const moduleAddresses = await module.deriveAddress({
        accountIndex,
        network,
        secretId,
        derivationPathType,
      });

      for (const [vmType, address] of Object.entries(moduleAddresses)) {
        addresses[vmType] = address;
      }
    }

    return addresses;
  }
}
