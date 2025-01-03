import { Network, NetworkContractToken } from '@avalabs/core-chains-sdk';
import { AccountsService } from '@src/background/services/accounts/AccountsService';
import { Balances } from '@src/background/services/balances/models';
import { BalanceAggregatorService } from '@src/background/services/balances/BalanceAggregatorService';
import { TokenManagerService } from '@src/background/services/tokens/TokenManagerService';
import { ethers } from 'ethers';
import { container } from 'tsyringe';
import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';
import {
  TokenType,
  TokenWithBalance,
  TokenWithBalanceERC20,
} from '@avalabs/vm-module-types';
import { bigIntToString } from '@avalabs/core-utils-sdk';

const UNKNOWN_TOKEN = (address: string): TokenWithBalanceERC20 => ({
  address,
  chainId: -1,
  type: TokenType.ERC20,
  name: 'UNKNOWN TOKEN',
  symbol: '-',
  balance: 0n,
  balanceDisplayValue: '0',
  decimals: 0,
});

export async function findToken(
  addressOrSymbol: string,
  network: Network,
): Promise<TokenWithBalance> {
  const balancesService = container.resolve(BalanceAggregatorService);
  const accountsService = container.resolve(AccountsService);
  const tokenManagerService = container.resolve(TokenManagerService);

  if (!network || !accountsService.activeAccount) {
    return UNKNOWN_TOKEN(addressOrSymbol);
  }

  let balances: Balances = balancesService.balances;

  if (!balances) {
    balances = (
      await balancesService.getBalancesForNetworks(
        [network.chainId],
        [accountsService.activeAccount],
        [TokenType.NATIVE, TokenType.ERC20],
      )
    ).tokens;
  }

  const token =
    balances[network.chainId]?.[accountsService.activeAccount.addressC]?.[
      addressOrSymbol.toLowerCase()
    ];

  if (token) {
    return token;
  }

  const provider = await getProviderForNetwork(network);
  if (!(provider instanceof JsonRpcBatchInternal)) {
    return UNKNOWN_TOKEN(addressOrSymbol);
  }

  if (addressOrSymbol === network.networkToken.symbol) {
    const balance = await provider.getBalance(
      accountsService.activeAccount.addressC,
    );
    return {
      ...network.networkToken,
      coingeckoId: network.pricingProviders?.coingecko.nativeTokenId ?? '',
      balance,
      balanceDisplayValue: bigIntToString(
        balance,
        network.networkToken.decimals,
      ),
      type: TokenType.NATIVE,
    };
  }

  // the token is unknown, fetch basic data
  let tokenData: NetworkContractToken | null;
  try {
    tokenData = await tokenManagerService.getTokenData(
      addressOrSymbol,
      network,
    );
  } catch (_err) {
    return UNKNOWN_TOKEN(addressOrSymbol);
  }

  const contract = new ethers.Contract(addressOrSymbol, ERC20.abi, provider);

  if (!contract.balanceOf || !tokenData) {
    return UNKNOWN_TOKEN(addressOrSymbol);
  }

  const balance = await contract.balanceOf(
    accountsService.activeAccount.addressC,
  );

  return {
    ...tokenData,
    balance: balance,
    balanceDisplayValue: bigIntToString(balance, tokenData.decimals),
    type: TokenType.ERC20,
  };
}
