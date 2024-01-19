import { Network, NetworkContractToken } from '@avalabs/chains-sdk';
import { AccountsService } from '@src/background/services/accounts/AccountsService';
import {
  TokenType,
  TokenWithBalance,
  TokenWithBalanceERC20,
} from '@src/background/services/balances/models';
import { BalanceAggregatorService } from '@src/background/services/balances/BalanceAggregatorService';
import { NetworkService } from '@src/background/services/network/NetworkService';
import { TokenManagerService } from '@src/background/services/tokens/TokenManagerService';
import BN from 'bn.js';
import { ethers } from 'ethers';
import { container } from 'tsyringe';
import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { JsonRpcBatchInternal } from '@avalabs/wallets-sdk';

const UNKNOWN_TOKEN = (address: string): TokenWithBalanceERC20 => ({
  address,
  chainId: -1,
  type: TokenType.ERC20,
  contractType: 'ERC-20',
  name: 'UNKNOWN TOKEN',
  symbol: '-',
  balance: new BN(0),
  decimals: 0,
});

export async function findToken(
  addressOrSymbol: string,
  otherNetwork?: Network
): Promise<TokenWithBalance> {
  const balancesService = container.resolve(BalanceAggregatorService);
  const networkService = container.resolve(NetworkService);
  const accountsService = container.resolve(AccountsService);
  const tokenManagerService = container.resolve(TokenManagerService);
  const network = otherNetwork ?? networkService.activeNetwork;

  if (!balancesService.balances || !network || !accountsService.activeAccount) {
    return UNKNOWN_TOKEN(addressOrSymbol);
  }

  if (!balancesService.balances[network.chainId]) {
    await balancesService.updateBalancesForNetworks(
      [network.chainId],
      [accountsService.activeAccount]
    );
  }

  const token =
    balancesService.balances[network.chainId]?.[
      accountsService.activeAccount.addressC
    ]?.[addressOrSymbol.toLowerCase()];

  if (token) {
    return token;
  }

  const provider = networkService.getProviderForNetwork(network);
  if (!(provider instanceof JsonRpcBatchInternal)) {
    return UNKNOWN_TOKEN(addressOrSymbol);
  }

  if (addressOrSymbol === network.networkToken.symbol) {
    return {
      ...network.networkToken,
      balance: new BN(
        (
          await provider.getBalance(accountsService.activeAccount.addressC)
        ).toString()
      ),
      type: TokenType.NATIVE,
    };
  }

  // the token is unknown, fetch basic data
  let tokenData: NetworkContractToken | null;
  try {
    tokenData = await tokenManagerService.getTokenData(
      addressOrSymbol,
      network
    );
  } catch (e) {
    return UNKNOWN_TOKEN(addressOrSymbol);
  }

  const contract = new ethers.Contract(addressOrSymbol, ERC20.abi, provider);

  if (!contract.balanceOf || !tokenData) {
    return UNKNOWN_TOKEN(addressOrSymbol);
  }

  const balance = await contract.balanceOf(
    accountsService.activeAccount.addressC
  );

  return {
    ...tokenData,
    balance: balance,
    type: TokenType.ERC20,
    contractType: 'ERC-20',
  };
}
