import { ChainId } from '@avalabs/chains-sdk';
import { NetworkService } from '../network/NetworkService';
import { AccountsService } from '../accounts/AccountsService';
import { OnboardingService } from './OnboardingService';
import { LockService } from '../lock/LockService';

export interface FinalizeOnboardingParams {
  networkService: NetworkService;
  accountsService: AccountsService;
  onboardingService: OnboardingService;
  lockService: LockService;
  password: string;
}

export async function finalizeOnboarding({
  networkService,
  accountsService,
  onboardingService,
  lockService,
  password,
}: FinalizeOnboardingParams) {
  await networkService.addFavoriteNetwork(ChainId.BITCOIN);
  await networkService.addFavoriteNetwork(ChainId.ETHEREUM_HOMESTEAD);

  const account = accountsService.getAccountList()[0];
  await accountsService.activateAccount(account?.id ?? '');
  await onboardingService.setIsOnboarded(true);

  await lockService.unlock(password);
}
