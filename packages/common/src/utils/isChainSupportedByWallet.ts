import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { SecretType } from '@core/types';

export const isChainSupportedByWallet = (
  networkType: NetworkVMType,
  secretType?: SecretType,
) => {
  if (!networkType || !secretType) {
    return false;
  }

  switch (networkType) {
    case NetworkVMType.EVM:
      return true;
    case NetworkVMType.AVM:
    case NetworkVMType.PVM:
    case NetworkVMType.CoreEth:
      return (
        secretType === SecretType.Mnemonic ||
        secretType === SecretType.Seedless ||
        secretType === SecretType.PrivateKey ||
        secretType === SecretType.Ledger ||
        secretType === SecretType.LedgerLive ||
        secretType === SecretType.Keystone3Pro
      );
    case NetworkVMType.SVM:
      return (
        secretType === SecretType.Mnemonic ||
        secretType === SecretType.Seedless ||
        secretType === SecretType.Ledger ||
        secretType === SecretType.LedgerLive
      );

    case NetworkVMType.BITCOIN:
      return (
        secretType === SecretType.Mnemonic ||
        secretType === SecretType.Seedless ||
        secretType === SecretType.PrivateKey ||
        secretType === SecretType.Ledger ||
        secretType === SecretType.LedgerLive ||
        secretType === SecretType.Keystone ||
        secretType === SecretType.Keystone3Pro
      );

    case NetworkVMType.HVM:
      return (
        secretType === SecretType.Mnemonic ||
        secretType === SecretType.PrivateKey
      );
    default:
      return false;
  }
};
