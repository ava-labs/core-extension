import { SecretType, SeedlessAuthProvider } from '@core/types';

export type HeaderWalletDetails = {
  id: string;
  name: string;
  type?: SecretType;
  authProvider?: SeedlessAuthProvider;
};
