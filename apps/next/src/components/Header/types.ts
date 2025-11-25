import { SecretType, SeedlessAuthProvider } from '@core/types';

export type HeaderWalletDetails = {
  id: string;
  name: string;
  isTrueWallet: boolean;
  type?: SecretType;
  authProvider?: SeedlessAuthProvider;
};
