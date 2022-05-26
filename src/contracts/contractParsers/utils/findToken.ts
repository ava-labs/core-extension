import { Erc20Token, getErc20Token } from '@avalabs/avalanche-wallet-sdk';
import { AccountsService } from '@src/background/services/accounts/AccountsService';
import { NetworkContractTokenWithBalance } from '@src/background/services/balances/models';
import { NetworkBalanceAggregatorService } from '@src/background/services/balances/NetworkBalanceAggregatorService';
import { NetworkService } from '@src/background/services/network/NetworkService';
import BN from 'bn.js';
import { container } from 'tsyringe';

const UNKNOWN_TOKEN = (address: string): NetworkContractTokenWithBalance => ({
  address,
  isERC20: true,
  isNetworkToken: false,
  contractType: '',
  logoUri: '',
  resourceLinks: [],
  name: 'UNKNOWN TOKEN',
  symbol: '-',
  balance: new BN(0),
  decimals: 0,
});

export async function findToken(
  address: string
): Promise<NetworkContractTokenWithBalance> {
  // TODO refactor to use contstructor / services instead of container.resolve
  const balancesService = container.resolve(NetworkBalanceAggregatorService);
  const networkService = container.resolve(NetworkService);
  const accountsService = container.resolve(AccountsService);
  const activeNetwork = await networkService.activeNetwork.promisify();
  if (
    !balancesService.balances ||
    !activeNetwork ||
    !accountsService.activeAccount
  ) {
    return UNKNOWN_TOKEN(address);
  }

  const token = balancesService.balances[activeNetwork.chainId][
    accountsService.activeAccount.addressC
  ].find((t) => t.isERC20 && t.address.toLowerCase() === address.toLowerCase());

  if (token && token.isERC20) {
    return token;
  }

  // the token is unknown, fetch basic data
  let tokenData: Erc20Token;
  try {
    tokenData = await getErc20Token(address);
  } catch (e) {
    return UNKNOWN_TOKEN(address);
  }

  if (!tokenData) {
    return UNKNOWN_TOKEN(address);
  }

  const balance = await tokenData.balanceOf(
    accountsService.activeAccount.addressC
  );

  return {
    ...tokenData,
    balance: balance,
    isERC20: true,
    isNetworkToken: false,
    contractType: '',
    logoUri: '',
    resourceLinks: [],
  };
}
