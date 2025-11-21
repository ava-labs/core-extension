import { EVM_BASE_DERIVATION_PATH, PrimaryWalletSecrets } from '@core/types';

export const getAvalancheXPub = (
  secrets: PrimaryWalletSecrets,
  accountIndex: number,
) => {
  if (!secrets || !('extendedPublicKeys' in secrets)) {
    return;
  }

  return secrets.extendedPublicKeys.find(
    (key) =>
      key.curve === 'secp256k1' &&
      key.derivationPath === getAvalancheExtendedKeyPath(accountIndex),
  );
};

export const getEvmExtendedKeyPath = () => EVM_BASE_DERIVATION_PATH;

export const getAvalancheXpBasePath = () => `m/44'/9000'/`;

export const getAvalancheExtendedKeyPath = (accountIndex: number) =>
  `${getAvalancheXpBasePath()}${accountIndex}'`;
