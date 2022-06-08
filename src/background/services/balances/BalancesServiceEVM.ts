import { Provider } from '@ethersproject/providers';
import { singleton } from 'tsyringe';
import { ethers } from 'ethers';
import {
  balanceToDisplayValue,
  ethersBigNumberToBig,
  bigToBN,
  numberToBN,
  ethersBigNumberToBN,
  bnToBig,
} from '@avalabs/utils-sdk';
import { NetworkService } from '@src/background/services/network/NetworkService';
import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { TokenPricesService } from '@src/background/services/balances/TokenPricesService';
import {
  NetworkTokenWithBalance,
  TokenWithBalanceERC20,
  TokenWithBalance,
  TokenType,
} from './models';
import { Network, NetworkContractToken } from '@avalabs/chains-sdk';
import { TokenManagerService } from '../tokens/TokenManagerService';
import { JsonRpcBatchInternal } from '@avalabs/wallets-sdk';
import { SettingsService } from '../settings/SettingsService';
import BN from 'bn.js';
import { Account } from '../accounts/models';

@singleton()
export class BalancesServiceEVM {
  constructor(
    private networkService: NetworkService,
    private tokenPricesService: TokenPricesService,
    private tokensManagerService: TokenManagerService,
    private settingsService: SettingsService
  ) {}

  getServiceForProvider(provider: any) {
    // I dont know another prop that would be more ethereum based. If you know of one then please
    // update.
    if (!!provider && !!(provider as any).getEtherPrice) return this;
  }

  private async getNativeTokenBalance(
    provider: Provider,
    userAddress: string,
    network: Network
  ): Promise<NetworkTokenWithBalance> {
    const balanceBig = await provider.getBalance(userAddress);
    const coingeckoTokenId = network.pricingProviders?.coingecko.nativeTokenId;
    const tokenPrice = coingeckoTokenId
      ? await this.tokenPricesService.getPriceByCoinId(
          coingeckoTokenId,
          (await this.settingsService.getSettings()).currency || 'usd'
        )
      : undefined;
    const big = ethersBigNumberToBig(balanceBig, network.networkToken.decimals);
    const balance = bigToBN(big, network.networkToken.decimals);

    return {
      ...network.networkToken,
      type: TokenType.NATIVE,
      balance,
      balanceDisplayValue: balanceToDisplayValue(balance, 18),
      priceUSD: tokenPrice,
      balanceUSD: big.mul(tokenPrice ?? 0).toNumber(),
      balanceUsdDisplayValue: tokenPrice
        ? big.mul(tokenPrice).toFixed(2)
        : undefined,
    };
  }

  private async getErc20Balances(
    provider: Provider,
    activeTokenList: {
      [address: string]: NetworkContractToken;
    },
    tokenPriceDict: {
      [address: string]: number;
    },
    userAddress: string
  ): Promise<TokenWithBalanceERC20[]> {
    const tokensBalances = await Promise.allSettled(
      Object.values(activeTokenList).map(async (token) => {
        const contract = new ethers.Contract(
          token.address,
          ERC20.abi,
          provider
        );
        const balanceBig = await contract.balanceOf(userAddress);
        const balance =
          ethersBigNumberToBN(balanceBig) ||
          numberToBN(0, token.decimals || 18);

        const tokenWithBalance = {
          ...token,
          balance,
        };

        return tokenWithBalance;
      })
    ).then((res) => {
      return res.reduce<(NetworkContractToken & { balance: BN })[]>(
        (acc, result) => {
          return result.status === 'fulfilled' ? [...acc, result.value] : acc;
        },
        []
      );
    });

    if (!tokensBalances) return [];
    return tokensBalances.map((token) => {
      const priceUSD = tokenPriceDict[token.address.toLowerCase()];

      const balanceNum = bnToBig(token.balance, token.decimals);
      const balanceUSD =
        priceUSD && balanceNum ? balanceNum.times(priceUSD).toNumber() : 0;
      const balanceDisplayValue = balanceToDisplayValue(
        token.balance,
        token.decimals
      );

      return {
        ...token,
        type: TokenType.ERC20,
        balanceDisplayValue,
        priceUSD,
        balanceUSD,
        balanceUsdDisplayValue: priceUSD
          ? isNaN(balanceUSD)
            ? ''
            : balanceUSD.toFixed(2)
          : '0',
      };
    });
  }

  async getBalances(
    account: Account,
    network: Network
  ): Promise<{ address: string; balances: TokenWithBalance[] }> {
    const provider = this.networkService.getProviderForNetwork(network);
    const customTokens = await this.tokensManagerService.getTokensForNetwork(
      network
    );
    const activeTokenList = [...customTokens, ...(network.tokens || [])];
    const coingeckoTokenId = network.pricingProviders?.coingecko.nativeTokenId;
    const coingeckoPlatformId =
      network.pricingProviders?.coingecko.assetPlatformId;
    const tokenPriceDict =
      coingeckoPlatformId && coingeckoTokenId
        ? await this.tokenPricesService.getTokenPricesByAddresses(
            activeTokenList,
            coingeckoPlatformId,
            coingeckoTokenId
          )
        : {};
    const nativeTok = await this.getNativeTokenBalance(
      provider as JsonRpcBatchInternal,
      account.addressC,
      network
    );

    const erc20Tokens = await this.getErc20Balances(
      provider as JsonRpcBatchInternal,
      activeTokenList.reduce(
        (acc, token) => ({ ...acc, [token.address]: token }),
        {}
      ),
      tokenPriceDict,
      account.addressC
    );

    return { address: account.addressC, balances: [nativeTok, ...erc20Tokens] };
  }
}
