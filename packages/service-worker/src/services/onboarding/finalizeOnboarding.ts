import { ChainId } from '@avalabs/core-chains-sdk';
import { NetworkService } from '../network/NetworkService';
import { AccountsService } from '../accounts/AccountsService';
import { OnboardingService } from './OnboardingService';
import { LockService } from '../lock/LockService';
import { runtime } from 'webextension-polyfill';
import { addChainsToFavoriteIfNeeded } from './utils/addChainsToFavoriteIfNeeded';

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

  const cChain = await networkService.getAvalancheNetwork();
  await networkService.setNetwork(runtime.id, cChain.caipId);

  const allAccounts = await accountsService.getAccounts();
  const addedAccounts = allAccounts.primary[walletId];

  if (addedAccounts) {
    await addChainsToFavoriteIfNeeded(addedAccounts);
  }

  const account = addedAccounts?.[0];
  await accountsService.activateAccount(account?.id ?? '');
  await onboardingService.setIsOnboarded(true);

  await lockService.unlock(password);
}
