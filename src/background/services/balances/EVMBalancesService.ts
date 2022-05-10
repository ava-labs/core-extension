import { activeTokenList$ } from '@avalabs/wallet-react-components';
import { User } from '@avalabs/blizzard-sdk';
import { Provider } from '@ethersproject/providers';
import { singleton } from 'tsyringe';
import { ethers } from 'ethers';
import {
  balanceToDisplayValue,
  ethersBigNumberToBig,
  bigToBN,
  numberToBN,
} from '@avalabs/utils-sdk';
import {
  ActiveNetwork,
  NetworkTypes,
} from '@src/background/services/network/models';
import { NetworkService } from '@src/background/services/network/NetworkService';
import { JsonRpcBatchInternal } from '@avalabs/wallets-sdk';
import { firstValueFrom } from 'rxjs';
const hstABI = require('human-standard-token-abi');
import { TokenPricesService } from '@src/background/services/balances/TokenPricesService';
import { TokenListDict, TokenWithBalance } from './models';
@singleton()
export class EVMBalancesService {
  constructor(
    private networkService: NetworkService,
    private tokenPricesService: TokenPricesService
  ) {}

  getServiceForProvider(provider: any) {
    // I dont know another prop that would be more ethereum based. If you know of one then please
    // update.
    if (!!provider && !!(provider as any).getEtherPrice) return this;
  }

  private async getNativeTokenBalance(
    provider: Provider,
    userAddress: string,
    network: ActiveNetwork
  ) {
    const balanceBig = await provider.getBalance(userAddress);
    const tokenPrice = await this.tokenPricesService.getPriceByCoinId(
      network.nativeToken.coinId,
      network.platformId
    );
    const big = ethersBigNumberToBig(
      balanceBig,
      network.nativeToken.denomination
    );
    const balance = bigToBN(big, network.nativeToken.denomination);

    return {
      ...network.nativeToken,
      balance,
      balanceDisplayValue: balanceToDisplayValue(balance, 18),
      balanceUsdDisplayValue: tokenPrice
        ? big.mul(tokenPrice.price).toFixed(2)
        : undefined,
      priceUSD: tokenPrice,
    };
  }

  private async getErc20Balances(
    provider: Provider,
    activeTokenList: TokenListDict,
    tokenPriceDict: {
      [address: string]: number;
    },
    userAddress: string
  ) {
    const tokensBalances: TokenWithBalance[] = await Promise.allSettled(
      Object.values(activeTokenList).map(async (token) => {
        const contract = new ethers.Contract(token.address, hstABI, provider);
        const balanceBig = await contract.balanceOf(userAddress);
        const balance =
          ethersBigNumberToBig(balanceBig, token.decimals) ||
          numberToBN(0, token.decimals || 18);

        const tokenWithBalance = {
          ...token,
          balance,
        };

        return tokenWithBalance;
      })
    ).then((res) => {
      return res.reduce((acc: any[], result) => {
        return result.status === 'fulfilled' ? [...acc, result.value] : acc;
      }, []);
    });

    if (!tokensBalances) return [];

    return tokensBalances.map((token) => {
      const priceUSD = tokenPriceDict[(token.address as string).toLowerCase()];

      const balanceNum = token.balance?.toNumber();
      const balanceUSD = priceUSD || balanceNum ? priceUSD * balanceNum : 0;
      const balanceDisplayValue = balanceToDisplayValue(
        token.balance,
        token.decimals as number
      );

      return {
        ...token,
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

  private async getErc721Balances(userAddress: string) {
    const user = new User({ baseUrl: 'https://blizzard.avax.network' });
    const result = await user.getNftState(userAddress);
    return result.data ?? [];
  }

  async getBalances(userAddress: string, network: NetworkTypes) {
    const provider = this.networkService.getProviderForNetwork(
      network
    ) as JsonRpcBatchInternal;
    const activeTokenList = await firstValueFrom(activeTokenList$);
    const tokenPriceDict =
      await this.tokenPricesService.getTokenPricesByAddresses(
        Object.values(activeTokenList),
        network.platformId,
        network.nativeToken.coinId
      );
    const nativeTok = await this.getNativeTokenBalance(
      provider,
      userAddress,
      network
    );

    const erc20Tokens = await this.getErc20Balances(
      provider,
      activeTokenList,
      tokenPriceDict,
      userAddress
    );

    const nftStates = await await this.getErc721Balances(userAddress);
    return [nativeTok, ...erc20Tokens, ...nftStates];
  }
}
