import { ChainId } from '@avalabs/chains-sdk';
import { NetworkService } from '../network/NetworkService';
import { AccountsService } from '../accounts/AccountsService';
import { OnboardingService } from './OnboardingService';
import { LockService } from '../lock/LockService';
import { runtime } from 'webextension-polyfill';
import { addXPChainToFavoriteIfNeeded } from './utils/addXPChainsToFavoriteIfNeeded';

export interface FinalizeOnboardingParams {
  walletId: string;
  networkService: NetworkService;
  accountsService: AccountsService;
  onboardingService: OnboardingService;
  lockService: LockService;
  password: string;
}

export async function finalizeOnboarding({
  walletId,
  networkService,
  accountsService,
  onboardingService,
  lockService,
  password,
}: FinalizeOnboardingParams) {
  await networkService.addFavoriteNetwork(ChainId.BITCOIN);
  await networkService.addFavoriteNetwork(ChainId.ETHEREUM_HOMESTEAD);

  await networkService.setNetwork(
    runtime.id,
    await networkService.getAvalancheNetwork()
  );

  const allAccounts = accountsService.getAccounts();
  const addedAccounts = allAccounts.primary[walletId];

  if (addedAccounts) {
    await addXPChainToFavoriteIfNeeded(addedAccounts);
  }

  const account = addedAccounts?.[0];
  await accountsService.activateAccount(account?.id ?? '');
  await onboardingService.setIsOnboarded(true);

  await lockService.unlock(password);
}
