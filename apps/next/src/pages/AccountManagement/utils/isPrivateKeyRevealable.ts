import { Account, AccountType, SecretType } from '@core/types';

const SUPPORTED_ACCOUNT_TYPES = [
  AccountType.PRIMARY,
  AccountType.IMPORTED,
] as const;

type SupportedAccountType = (typeof SUPPORTED_ACCOUNT_TYPES)[number];

export function isPrivateKeyRevealable(secretType: SecretType): boolean;
export function isPrivateKeyRevealable(
  account: Account,
): account is Extract<Account, { type: SupportedAccountType }>;
export function isPrivateKeyRevealable(
  accountOrSecretType: Account | SecretType,
): boolean {
  if (typeof accountOrSecretType === 'object') {
    const account = accountOrSecretType;
    return SUPPORTED_ACCOUNT_TYPES.includes(
      account.type as SupportedAccountType,
    );
  }

  const secretType = accountOrSecretType;
  return (
    secretType === SecretType.Mnemonic || secretType === SecretType.PrivateKey
  );
}
