import { NetworkVMType, Module } from '@avalabs/vm-module-types';
import { DerivationPath } from '@avalabs/core-wallets-sdk';

import type { ModuleManager } from '~/vmModules/ModuleManager';

import type { NetworkService } from '../network/NetworkService';
import type { SecretsService } from './SecretsService';
import { AddressResolver } from './AddressResolver';
import {
  expectToThrowErrorCode,
  matchingPayload,
} from '@shared/tests/test-utils';
import { SecretsError, SecretType } from '@core/types';
import { ChainId } from '@avalabs/core-chains-sdk';
import { noop } from '@core/common';

describe('src/background/services/secrets/AddressResolver', () => {
  let addressResolver: AddressResolver;
  let networkService: jest.Mocked<NetworkService>;
  let secretsService: jest.Mocked<SecretsService>;
  let moduleManager: jest.Mocked<ModuleManager>;

  beforeEach(() => {
    networkService = {
      activeNetworks: { promisify: jest.fn() },
      uiActiveNetwork: undefined,
    } as unknown as jest.Mocked<NetworkService>;
    secretsService = {
      getSecretsById: jest.fn(),
    } as unknown as jest.Mocked<SecretsService>;
    moduleManager = {
      loadModuleByNetwork: jest.fn(),
      modules: [],
    } as unknown as jest.Mocked<ModuleManager>;

    addressResolver = new AddressResolver(networkService, secretsService);
    addressResolver.init(moduleManager);
    jest.spyOn(console, 'warn').mockImplementation(noop);
  });

  describe('getDerivationPathsByVM()', () => {
    it('throws if required derivation path was not built', async () => {
      // eslint-disable-next-line
      // @ts-ignore
      moduleManager.modules = [];

      await expectToThrowErrorCode(
        addressResolver.getDerivationPathsByVM(0, DerivationPath.BIP44, [
          NetworkVMType.AVM,
        ]),
        SecretsError.DerivationPathMissing,
      );
    });

    it('should return derivation paths for specified VMs', async () => {
      const evmModuleMock = {
        buildDerivationPath: jest.fn().mockResolvedValue({
          [NetworkVMType.EVM]: "m/44'/60'/0'/0/0",
        }),
      } as unknown as Module;
      const avmModuleMock = {
        buildDerivationPath: jest.fn().mockResolvedValue({
          [NetworkVMType.AVM]: "m/44'/9000'/0'/0/0",
        }),
      } as unknown as Module;

      // eslint-disable-next-line
      // @ts-ignore
      moduleManager.modules = [evmModuleMock, avmModuleMock];

      const result = await addressResolver.getDerivationPathsByVM(
        0,
        DerivationPath.BIP44,
        [NetworkVMType.AVM, NetworkVMType.EVM],
      );

      expect(result).toEqual({
        [NetworkVMType.EVM]: "m/44'/60'/0'/0/0",
        [NetworkVMType.AVM]: "m/44'/9000'/0'/0/0",
      });
    });
  });

  describe('getAddressesForSecretId()', () => {
    it('simply returns the addresses for Fireblocks-type secrets ', async () => {
      secretsService.getSecretsById.mockResolvedValue({
        secretType: SecretType.Fireblocks,
        addresses: { addressC: 'address1', addressBTC: 'address2' },
      });

      const result = await addressResolver.getAddressesForSecretId('secretId');

      expect(result).toEqual(
        matchingPayload({
          [NetworkVMType.EVM]: 'address1',
          [NetworkVMType.BITCOIN]: 'address2',
        }),
      );
    });

    it('simply returns the addresses for WalletConnect secret type', async () => {
      secretsService.getSecretsById.mockResolvedValue({
        secretType: SecretType.WalletConnect,
        addresses: {
          addressC: 'address1',
          addressAVM: 'address2',
          addressPVM: 'address3',
          addressBTC: 'address4',
          addressCoreEth: 'address5',
        },
      });

      const result = await addressResolver.getAddressesForSecretId('secretId');

      expect(result).toEqual(
        matchingPayload({
          [NetworkVMType.EVM]: 'address1',
          [NetworkVMType.AVM]: 'address2',
          [NetworkVMType.PVM]: 'address3',
          [NetworkVMType.BITCOIN]: 'address4',
          [NetworkVMType.CoreEth]: 'address5',
        }),
      );
    });

    it('derives the addresses for other secret types using VM Modules', async () => {
      secretsService.getSecretsById.mockResolvedValue({
        secretType: SecretType.Mnemonic,
      } as any);

      jest.spyOn(networkService.activeNetworks, 'promisify').mockResolvedValue(
        Promise.resolve({
          [ChainId.AVALANCHE_X]: { vmName: NetworkVMType.AVM },
          [ChainId.AVALANCHE_MAINNET_ID]: { vmName: NetworkVMType.EVM },
          [ChainId.BITCOIN]: { vmName: NetworkVMType.BITCOIN },
        } as any),
      );

      jest
        .spyOn(moduleManager, 'loadModuleByNetwork')
        .mockResolvedValueOnce({
          deriveAddress: jest.fn().mockResolvedValue({
            [NetworkVMType.AVM]: 'address-x-chain',
            [NetworkVMType.PVM]: 'address-p-chain',
          }),
        } as any)
        .mockResolvedValueOnce({
          deriveAddress: jest.fn().mockResolvedValue({
            [NetworkVMType.BITCOIN]: 'address-btc',
          }),
        } as any)
        .mockResolvedValueOnce({
          deriveAddress: jest.fn().mockResolvedValue({
            [NetworkVMType.EVM]: 'address-evm',
          }),
        } as any);

      const result = await addressResolver.getAddressesForSecretId(
        'secretId',
        0,
        DerivationPath.BIP44,
      );

      expect(result).toEqual(
        matchingPayload({
          [NetworkVMType.EVM]: 'address-evm',
          [NetworkVMType.AVM]: 'address-x-chain',
          [NetworkVMType.PVM]: 'address-p-chain',
          [NetworkVMType.BITCOIN]: 'address-btc',
        }),
      );
    });

    it('returns empty addresses for modules that fail the derivation', async () => {
      secretsService.getSecretsById.mockResolvedValue({
        secretType: SecretType.Mnemonic,
      } as any);

      jest.spyOn(networkService.activeNetworks, 'promisify').mockResolvedValue(
        Promise.resolve({
          [ChainId.AVALANCHE_X]: { vmName: NetworkVMType.AVM },
          [ChainId.AVALANCHE_MAINNET_ID]: { vmName: NetworkVMType.EVM },
          [ChainId.BITCOIN]: { vmName: NetworkVMType.BITCOIN },
        } as any),
      );

      jest
        .spyOn(moduleManager, 'loadModuleByNetwork')
        .mockResolvedValueOnce({
          deriveAddress: jest.fn().mockRejectedValueOnce(new Error('Ooopsies')),
        } as any)
        .mockResolvedValueOnce({
          deriveAddress: jest.fn().mockResolvedValue({
            [NetworkVMType.BITCOIN]: 'address-btc',
          }),
        } as any);

      const result = await addressResolver.getAddressesForSecretId(
        'secretId',
        0,
        DerivationPath.BIP44,
      );

      expect(result).toEqual(
        matchingPayload({
          [NetworkVMType.EVM]: '',
          [NetworkVMType.BITCOIN]: 'address-btc',
        }),
      );
    });
  });
});
