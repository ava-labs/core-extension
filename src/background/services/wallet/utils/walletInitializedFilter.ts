import { filter, Observable, OperatorFunction } from 'rxjs';
import { WalletType } from '@avalabs/avalanche-wallet-sdk';

export const walletInitializedFilter =
  () => (oberserver: Observable<WalletType | undefined>) =>
    oberserver.pipe(
      filter((result) => result !== undefined) as OperatorFunction<
        WalletType | undefined,
        WalletType
      >
    );
