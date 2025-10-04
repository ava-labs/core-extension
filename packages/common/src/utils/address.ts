import { Avalanche } from '@avalabs/core-wallets-sdk';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { strip0x } from '@avalabs/core-utils-sdk';
import { Account } from '@core/types';
import { omitUndefined } from './object';
import { SignerSession } from '@cubist-labs/cubesigner-sdk';
import { SeedlessTokenStorage } from '../../../service-worker/src/services/seedless/SeedlessTokenStorage';

export const mapVMAddresses = (addresses: Record<NetworkVMType, string>) =>
  omitUndefined({
    addressC: addresses[NetworkVMType.EVM],
    addressBTC: addresses[NetworkVMType.BITCOIN] || undefined,
    addressAVM: addresses[NetworkVMType.AVM] || undefined,
    addressPVM: addresses[NetworkVMType.PVM] || undefined,
    addressCoreEth: addresses[NetworkVMType.CoreEth] || undefined,
    addressHVM: addresses[NetworkVMType.HVM] || undefined,
    addressSVM: addresses[NetworkVMType.SVM] || undefined,
  } as const);

export const mapAddressesToVMs = (
  account: Partial<Account>,
): Partial<Record<NetworkVMType, string>> =>
  omitUndefined({
    [NetworkVMType.EVM]: account.addressC,
    [NetworkVMType.BITCOIN]: account.addressBTC,
    [NetworkVMType.AVM]: account.addressAVM,
    [NetworkVMType.PVM]: account.addressPVM,
    [NetworkVMType.CoreEth]: account.addressCoreEth,
    [NetworkVMType.HVM]: account.addressHVM,
    [NetworkVMType.SVM]: account.addressSVM,
  } as const);

export const getAddressByVMType = (account: Account, vmType: NetworkVMType) =>
  mapAddressesToVMs(account)[vmType];

export function getAddressesInRange(
  xpubXP: string,
  providerXP: Avalanche.JsonRpcProvider,
  internal = false,
  start = 0,
  limit = 64,
) {
  const addresses: string[] = [];

  for (let i = start; i < start + limit; i++) {
    addresses.push(
      Avalanche.getAddressFromXpub(xpubXP, i, providerXP, 'P', internal).split(
        '-',
      )[1] as string,
    );
  }

  return addresses;
}

export async function getAddressesInRangeForSeedless(
  sessionStorage: SeedlessTokenStorage,
  isTestnet = false,
  start = 0,
  limit = 64,
) {
  console.log(
    'getAddressesInRangeForSeedless',
    sessionStorage,
    isTestnet,
    start,
    limit,
  );

  const session = await SignerSession.loadSignerSession(sessionStorage);
  // Get keys
  const keys = await session.keys();

  const keyType = isTestnet ? 'SecpAvaTestAddr' : 'SecpAvaAddr';

  const filteredKeys = keys.filter((key) => key.key_type === keyType);
  console.log({ keys, filteredKeys });

  if (!filteredKeys.length) {
    return [];
  }

  const addresses: string[] = [];
  const avalancheProvider = isTestnet
    ? Avalanche.JsonRpcProvider.getDefaultFujiProvider()
    : Avalanche.JsonRpcProvider.getDefaultMainnetProvider();

  for (let i = start; i < start + limit; i++) {
    const accountKey = filteredKeys[i];
    console.log({ accountKey });
    if (accountKey) {
      console.log({ accountKey });
      if (accountKey) {
        const address = avalancheProvider.getAddress(
          toBuffer(accountKey.publicKey),
          'P',
        );
        const xpAddress = address.replace('P-', '');
        addresses.push(xpAddress);
        console.log({ address, xpAddress });
      }
    }
  }
  console.log('addresses', addresses);
  return addresses;
}
const toBuffer = (hex: string): Buffer => Buffer.from(strip0x(hex), 'hex');
