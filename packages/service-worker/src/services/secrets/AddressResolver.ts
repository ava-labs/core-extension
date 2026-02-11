import { pick } from 'lodash';
import { singleton } from 'tsyringe';
import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { Module, NetworkVMType } from '@avalabs/vm-module-types';

import type { ModuleManager } from '../../vmModules/ModuleManager';
import {
  PickKeys,
  DerivationPathsMap,
  SecretType,
  NetworkWithCaipId,
  CommonError,
  SecretsError,
} from '@core/types';
import {
  assertPresent,
  getAvalancheXPub,
  stripAddressPrefix,
} from '@core/common';

import { NetworkService } from '../network/NetworkService';
import {
  emptyAddresses,
  emptyDerivationPaths,
  isPrimaryWalletSecrets,
} from './utils';
import { SecretsService } from './SecretsService';
import { hex } from '@scure/base';
import { AddressIndex } from '@avalabs/types';
import { profileApiClient } from '~/api-clients';
import { postV1GetAddresses } from '~/api-clients/profile-api';

@singleton()
export class AddressResolver {
  #moduleManager?: ModuleManager;

  constructor(
    private readonly networkService: NetworkService,
    private readonly secretsService: SecretsService,
  ) {}

  /**
   * We're not using the dependency injection here due to cyclic dependency that's hard to resolve at the moment.
   *
   * ModuleManager -> ApprovalController -> WalletService -> AccountsService -> AddressResolver -> ModuleManager
   */
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
    addressIndex?: number,
  ): Promise<PickKeys<DerivationPathsMap, VMs>> {
    assertPresent(this.#moduleManager, CommonError.ModuleManagerNotSet);

    const derivationPaths = emptyDerivationPaths();

    for (const module of this.#moduleManager.modules) {
      const modulePaths = await module.buildDerivationPath({
        accountIndex,
        derivationPathType,
        addressIndex,
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

  async getXPAddressesForAccountIndex(
    secretId: string,
    accountIndex: number,
    vm: 'AVM' | 'PVM',
  ): Promise<{
    externalAddresses: AddressIndex[];
    internalAddresses: AddressIndex[];
  }> {
    const secrets = await this.secretsService.getSecretsById(secretId);

    if (!isPrimaryWalletSecrets(secrets)) {
      return {
        externalAddresses: [],
        internalAddresses: [],
      };
    }

    const avalancheXPub = getAvalancheXPub(secrets, accountIndex);
    if (avalancheXPub) {
      // If possible, use the Profile Service API

      const body = {
        extendedPublicKey: avalancheXPub.key,
        isTestnet: !this.networkService.isMainnet(),
        onlyWithActivity: true,
      };
      const { data: addresses, error: error } = await postV1GetAddresses({
        client: profileApiClient,
        body: {
          ...body,
          networkType: vm,
        },
      });

      if (error) {
        throw new Error('Failed to get XP addresses from extended public key');
      }

      const externalAddresses =
        addresses?.externalAddresses?.map((address) => ({
          address: stripAddressPrefix(address.address),
          index: address.index,
        })) ?? [];

      const internalAddresses =
        addresses?.internalAddresses?.map((address) => ({
          address: stripAddressPrefix(address.address),
          index: address.index,
        })) ?? [];

      return {
        externalAddresses,
        internalAddresses,
      };
    }

    const publicKeys = await this.secretsService.getAvalanchePublicKeys(
      secretId,
      accountIndex,
    );
    const provider = await this.networkService.getAvalanceProviderXP();

    const addressIndices: AddressIndex[] = [];

    for (const { curve, derivationPath, key } of publicKeys) {
      // Reject non-Secp256k1 keys
      if (curve !== 'secp256k1') continue;

      // Reject keys that are not for the given index
      if (!derivationPath.startsWith(`m/44'/9000'/${accountIndex}'/`)) continue;

      // Just some future-proofing - we expect the derivation path to have 6 segments,
      // separated by '/':
      const segments = derivationPath.split('/');
      if (segments.length !== 6) {
        throw new Error(
          `Invalid derivation path for X/P public key: ${derivationPath}. Expected 6 segments, got ${segments.length}.`,
        );
      }

      // Take the last index from the derivation path - this is our address index
      const addressIndex = Number(segments.pop());

      if (Number.isNaN(addressIndex) || !Number.isInteger(addressIndex)) {
        throw new Error(
          `Invalid address index obtained, expected an integer, got ${addressIndex}`,
        );
      }

      addressIndices.push({
        address: stripAddressPrefix(
          provider.getAddress(Buffer.from(hex.decode(key)), 'P'),
        ),
        index: addressIndex,
      });
    }

    return {
      externalAddresses: addressIndices,
      internalAddresses: [],
    };
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
          console.warn(
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
