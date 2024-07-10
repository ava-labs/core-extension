import { singleton } from 'tsyringe';
import { JsonRpcProvider, Provider, ethers } from 'ethers';
import {
  balanceToDisplayValue,
  bigToBN,
  numberToBN,
  bnToBig,
} from '@avalabs/utils-sdk';
import { NetworkService } from '@src/background/services/network/NetworkService';
import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { TokenPricesService } from '@src/background/services/balances/TokenPricesService';
import { NetworkTokenWithBalance, TokenWithBalance, TokenType } from './models';
import { NetworkContractToken } from '@avalabs/chains-sdk';
import { TokenManagerService } from '../tokens/TokenManagerService';
import { JsonRpcBatchInternal } from '@avalabs/wallets-sdk';
import { SettingsService } from '../settings/SettingsService';
import BN from 'bn.js';
import { Account } from '../accounts/models';
import * as Sentry from '@sentry/browser';
import { bigintToBig } from '@src/utils/bigintToBig';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';
import { Network } from '../network/models';
import { TokensPriceShortData } from '../tokens/models';

@singleton()
export class BalancesServiceEVM {
  constructor(
    private networkService: NetworkService,
    private tokenPricesService: TokenPricesService,
    private tokensManagerService: TokenManagerService,
    private settingsService: SettingsService
  ) {}

  getServiceForProvider(provider: any) {
    if (!!provider && provider instanceof JsonRpcProvider) return this;
  }

  public async getNativeTokenBalance(
    provider: Provider,
    userAddress: string,
    network: Network,
    tokenPrice?: number
  ): Promise<NetworkTokenWithBalance> {
    const balanceBig = await provider.getBalance(userAddress);
    const big = bigintToBig(balanceBig, network.networkToken.decimals);
    const balance = bigToBN(big, network.networkToken.decimals);

    return {
      ...network.networkToken,
      type: TokenType.NATIVE,
      balance,
      balanceDisplayValue: balanceToDisplayValue(balance, 18),
      priceUSD: tokenPrice,
      balanceUSD:
        tokenPrice === undefined ? undefined : big.mul(tokenPrice).toNumber(),
      balanceUsdDisplayValue:
        tokenPrice === undefined ? undefined : big.mul(tokenPrice).toFixed(2),
    };
  }

  private async getErc20Balances(
    provider: Provider,
    activeTokenList: {
      [address: string]: NetworkContractToken;
    },
    coingeckoInfo: {
      coingeckoPlatformId?: string;
      coingeckoTokenId?: string;
    },
    userAddress: string
  ): Promise<Record<string, TokenWithBalance>> {
    const tokensBalances = await Promise.allSettled(
      Object.values(activeTokenList).map(async (token) => {
        const contract = new ethers.Contract(
          token.address,
          ERC20.abi,
          provider
        );
        const balanceBig = await contract.balanceOf?.(userAddress);
        const balance =
          new BN(balanceBig) || numberToBN(0, token.decimals || 18);

        const tokenWithBalance = {
          ...token,
          balance,
        };

        return tokenWithBalance;
      })
    ).then((res) => {
      return res.reduce<(NetworkContractToken & { balance: BN })[]>(
        (acc, result) => {
          return result.status === 'fulfilled' && !result.value.balance.isZero()
            ? [...acc, result.value]
            : acc;
        },
        []
      );
    });

    if (!tokensBalances.length) return {};

    const { coingeckoPlatformId, coingeckoTokenId } = coingeckoInfo;
    const tokenPriceDict =
      coingeckoPlatformId && coingeckoTokenId
        ? await this.tokenPricesService.getTokenPricesByAddresses(
            tokensBalances,
            coingeckoPlatformId,
            coingeckoTokenId
          )
        : {};

    return tokensBalances.reduce((acc, token) => {
      const priceUSD = tokenPriceDict[token.address.toLowerCase()];

      const balanceNum = bnToBig(token.balance, token.decimals);
      const balanceUSD =
        priceUSD === undefined
          ? undefined
          : balanceNum.times(priceUSD).toNumber();
      const balanceDisplayValue = balanceToDisplayValue(
        token.balance,
        token.decimals
      );

      return {
        ...acc,
        [token.address.toLowerCase()]: {
          ...token,
          type: TokenType.ERC20,
          balanceDisplayValue,
          priceUSD,
          balanceUSD,
          balanceUsdDisplayValue: balanceUSD?.toFixed(2),
        },
      };
    }, {} as Record<string, TokenWithBalance>);
  }

  async getBalances(
    accounts: Account[],
    network: Network,
    priceChanges?: TokensPriceShortData // eslint-disable-line
  ): Promise<Record<string, Record<string, TokenWithBalance>>> {
    const sentryTracker = Sentry.startTransaction({
      name: 'BalancesServiceEVM: getBalances',
    });
    const provider = getProviderForNetwork(network, true);
    const customTokens =
      await this.tokensManagerService.getCustomTokensForNetwork(network);
    const activeTokenList = [...customTokens, ...(network.tokens || [])];
    const coingeckoTokenId = network.pricingProviders?.coingecko.nativeTokenId;
    const coingeckoPlatformId =
      network.pricingProviders?.coingecko.assetPlatformId;

    const nativeTokenPrice = coingeckoTokenId
      ? await this.tokenPricesService.getPriceByCoinId(
          coingeckoTokenId,
          (await this.settingsService.getSettings()).currency || 'usd'
        )
      : undefined;

    const balances = (
      await Promise.allSettled(
        accounts.map(async (account) => {
          const nativeTok = await this.getNativeTokenBalance(
            provider as JsonRpcBatchInternal,
            account.addressC,
            network,
            nativeTokenPrice
          );

          const erc20Tokens = await this.getErc20Balances(
            provider as JsonRpcBatchInternal,
            activeTokenList.reduce(
              (acc, token) => ({ ...acc, [token.address]: token }),
              {}
            ),
            { coingeckoTokenId, coingeckoPlatformId },
            account.addressC
          );
          return {
            address: account.addressC,
            balances: {
              [nativeTok.symbol]: nativeTok,
              ...erc20Tokens,
            },
          };
        })
      )
    ).reduce((acc, result) => {
      if (result.status === 'rejected') {
        return acc;
      }

      return {
        ...acc,
        [result.value.address]: result.value.balances,
      };
    }, {} as Record<string, Record<string, TokenWithBalance>>);

    sentryTracker.finish();
    return balances;
  }
}
