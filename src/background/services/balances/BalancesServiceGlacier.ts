import { Network, NetworkContractToken } from '@avalabs/chains-sdk';
import {
  NativeTokenBalance,
  Erc20TokenBalance,
  Erc721TokenBalance,
  Glacier,
  Erc1155TokenBalance,
  ListErc721BalancesResponse,
  ListErc1155BalancesResponse,
} from '@avalabs/glacier-sdk';
import { balanceToDisplayValue, bnToBig } from '@avalabs/utils-sdk';
import { singleton } from 'tsyringe';
import { SettingsService } from '../settings/SettingsService';
import { TokenManagerService } from '../tokens/TokenManagerService';
import {
  NetworkTokenWithBalance,
  TokenType,
  TokenWithBalance,
  TokenWithBalanceERC20,
  NftTokenWithBalance,
  NftMetadata,
  TokenAttribute,
  NftPageTokens,
} from './models';
import { BN } from 'bn.js';
import { Account } from '../accounts/models';
import { getSmallImageForNFT } from './nft/utils/getSmallImageForNFT';
import { ipfsResolverWithFallback } from '@src/utils/ipsfResolverWithFallback';
import * as Sentry from '@sentry/browser';
import { getNftMetadata } from '@src/utils/getNftMetadata';
import {
  is1155Response,
  isErc721TokenBalance,
} from './nft/utils/nftTypesUtils';

@singleton()
export class BalancesServiceGlacier {
  private glacierSdkInstance = new Glacier({ BASE: process.env.GLACIER_URL });
  constructor(
    private settingsService: SettingsService,
    private tokensManagerService: TokenManagerService
  ) {}

  async getBalances(
    accounts: Account[],
    network: Network
  ): Promise<Record<string, Record<string, TokenWithBalance>>> {
    const sentryTracker = Sentry.startTransaction({
      name: 'BalancesServiceGlacier: getBalances',
    });
    const selectedCurrency: any = (await this.settingsService.getSettings())
      .currency;
    const results = await Promise.allSettled(
      accounts.map(async (acc) => {
        const address = acc.addressC;
        return await Promise.allSettled([
          this.getNativeTokenBalanceForNetwork(
            network,
            address,
            selectedCurrency
          ),
          this.getErc20BalanceForNetwork(network, address, selectedCurrency),
        ])
          .then(([nativeBalance, erc20Balances]) => {
            let results: Record<string, TokenWithBalance> =
              nativeBalance.status === 'fulfilled'
                ? { [nativeBalance.value.symbol]: nativeBalance.value }
                : {};

            if (erc20Balances.status === 'fulfilled') {
              results = { ...results, ...erc20Balances.value };
            }
            return { [address]: results };
          })
          .catch(() => {
            return {};
          });
      })
    ).then((results) => {
      return results
        .filter(
          (
            item
          ): item is PromiseFulfilledResult<
            Record<string, Record<string, TokenWithBalance>>
          > => item.status === 'fulfilled'
        )
        .map((item) => item.value);
    });

    const result = results.reduce((acc, account) => {
      return { ...account, ...acc };
    }, {});
    sentryTracker.finish();
    return result;
  }

  getNativeTokenBalanceForNetwork(
    network: Network,
    address: string,
    selectedCurrency: any
  ) {
    return this.glacierSdkInstance.evm
      .getNativeBalance({
        chainId: network.chainId.toString(),
        address,
        currency: selectedCurrency.toLocaleLowerCase(),
      })
      .then((res) => res.nativeTokenBalance)
      .then((balance) =>
        this.convertNativeToTokenWithBalance(balance, balance.price?.value ?? 0)
      );
  }

  private convertNativeToTokenWithBalance(
    native: NativeTokenBalance,
    tokenPrice: number
  ): NetworkTokenWithBalance {
    const balance = new BN(native.balance);
    const usdBalance = bnToBig(balance, native.decimals).mul(tokenPrice);
    const balanceDisplayValue = balanceToDisplayValue(balance, native.decimals);

    return {
      ...native,
      logoUri: native.logoUri ?? '',
      type: TokenType.NATIVE,
      description: '',
      balance,
      balanceDisplayValue,
      priceUSD: tokenPrice,
      balanceUSD: usdBalance.toNumber() || 0,
      balanceUsdDisplayValue: tokenPrice ? usdBalance.toFixed(2) : undefined,
    };
  }

  async getErc20BalanceForNetwork(
    network: Network,
    address: string,
    selectedCurrency: any
  ) {
    const tokensWithBalance: TokenWithBalanceERC20[] = [];

    /**
     *  Load all pages to make sure we have all the tokens with balances
     */
    let nextPageToken: string | undefined = undefined;
    do {
      const response = await this.glacierSdkInstance.evm.listErc20Balances({
        chainId: network.chainId.toString(),
        address,
        currency: selectedCurrency.toLocaleLowerCase(),
        // glacier has a cap on page size of 100
        pageSize: 100,
        pageToken: nextPageToken,
      });

      tokensWithBalance.push(
        ...this.convertErc20ToTokenWithBalance(response.erc20TokenBalances)
      );
      nextPageToken = response.nextPageToken;
    } while (nextPageToken);

    const customTokens = await this.tokensManagerService.getTokensForNetwork(
      network
    );
    const activeTokenList = [...customTokens, ...(network.tokens || [])];
    /**
     * Glacier doesnt return tokens without balances so we need to polyfill that list
     * from our own list of tokens. We just set the balance to 0, these zero balance
     * tokens are only used for swap, bridge and tx parsing.
     */
    return [
      ...this.convertNetworkTokenToTokenWithBalance(activeTokenList),
      ...tokensWithBalance, // this needs to be second in the list so it overwrites its zero balance counterpart if there is one
    ].reduce((acc, token) => {
      return { ...acc, [token.address.toLowerCase()]: token };
    }, {});
  }

  private convertNetworkTokenToTokenWithBalance(
    tokens: NetworkContractToken[]
  ): TokenWithBalanceERC20[] {
    return tokens.map((token) => {
      return { ...token, type: TokenType.ERC20, balance: new BN(0) };
    });
  }

  private convertErc20ToTokenWithBalance(
    tokenBalances: Erc20TokenBalance[]
  ): TokenWithBalanceERC20[] {
    return tokenBalances.map(
      (token: Erc20TokenBalance): TokenWithBalanceERC20 => {
        const balance = new BN(token.balance);
        const tokenPrice = token.price?.value;
        const balanceDisplayValue = balanceToDisplayValue(
          balance,
          token.decimals
        );
        const usdBalance = bnToBig(balance, token.decimals).mul(
          tokenPrice ?? 0
        );

        return {
          ...token,
          chainId: Number(token.chainId),
          type: TokenType.ERC20,
          contractType: 'ERC-20',
          balance,
          address: token.address,
          balanceDisplayValue,
          priceUSD: tokenPrice,
          balanceUSD: usdBalance.toNumber() || 0,
          balanceUsdDisplayValue: tokenPrice
            ? usdBalance.toFixed(2)
            : undefined,
        };
      }
    );
  }

  async convertUnindexedToTokenWithBalance(
    token: Erc721TokenBalance | Erc1155TokenBalance
  ): Promise<NftTokenWithBalance> {
    const sentryTracker = Sentry.startTransaction({
      name: `Get NFT metadata for unindexed NFT and convert`,
      op: 'convertUnindexedNftToTokenWithBalance',
    });
    const tokenUri = token.tokenUri.replace(/0x{id}|{id}/g, token.tokenId);
    const data: NftMetadata = await getNftMetadata(tokenUri);
    const result = this.convertNftToTokenWithBalanceWithMetadata(token, data);
    sentryTracker.finish();
    return result;
  }

  async fetch721List(chainId: string, address: string, pageToken?: string) {
    return await this.glacierSdkInstance.evm.listErc721Balances({
      chainId: chainId,
      address,
      // glacier has a cap on page size of 100
      pageSize: 25,
      ...(pageToken ? { pageToken } : {}),
    });
  }

  async fetch1155List(chainId: string, address: string, pageToken?: string) {
    return await this.glacierSdkInstance.evm.listErc1155Balances({
      chainId: chainId,
      address,
      // glacier has a cap on page size of 100
      pageSize: 25,
      ...(pageToken ? { pageToken } : {}),
    });
  }

  /**
   * Comment for shouldFetch721 and shouldFetch1155
   * if the pageToken value is undefined, it is for first page fetch
   * if the pageToken value is a string, we use that as the pageToken to fetch
   * if the pageToken is empty string, there is no more pages
   */

  shouldFetch721(pageTokens: NftPageTokens) {
    return pageTokens[TokenType.ERC721] !== '';
  }

  shouldFetch1155(pageTokens: NftPageTokens) {
    return pageTokens[TokenType.ERC1155] !== '';
  }

  async getNFTBalanceForNetwork(
    network: Network,
    address: string,
    pageTokens: NftPageTokens
  ) {
    const sentryTracker = Sentry.startTransaction({
      name: `BalancesServiceGlacier: getNFTBalanceForNetwork for ${network.chainName}`,
      op: 'getNFTBalanceForNetwork',
    });

    const glacierSentryTracker = Sentry.startTransaction({
      name: `Glacier: Get NFTs for ${network.chainName}`,
      op: 'listErc721Balances',
    });

    const responseFor721 = this.shouldFetch721(pageTokens)
      ? this.fetch721List(
          network.chainId.toString(),
          address,
          pageTokens[TokenType.ERC721]
        )
      : ({ erc721TokenBalances: [] } as ListErc721BalancesResponse);

    const responseFor1155 = this.shouldFetch1155(pageTokens)
      ? this.fetch1155List(
          network.chainId.toString(),
          address,
          pageTokens[TokenType.ERC1155]
        )
      : ({ erc1155TokenBalances: [] } as ListErc1155BalancesResponse);

    glacierSentryTracker.finish();

    const metadataSentryTracker = Sentry.startTransaction({
      name: `Get NFT metadata and convert for ${network.chainName}`,
      op: 'listErc721Balances',
    });

    let nextPageTokenFor721;
    let nextPageTokenFor1155;

    return await Promise.allSettled([responseFor721, responseFor1155])
      .then(async (results) => {
        metadataSentryTracker.finish();
        const items = await Promise.allSettled(
          results
            .filter(
              (
                item
              ): item is
                | PromiseFulfilledResult<ListErc721BalancesResponse>
                | PromiseFulfilledResult<ListErc1155BalancesResponse> =>
                item.status === 'fulfilled'
            )
            .map((item) => {
              const is1155 = is1155Response(item);
              if (is1155) nextPageTokenFor1155 = item.value.nextPageToken;
              else nextPageTokenFor721 = item.value.nextPageToken;

              return is1155
                ? item.value.erc1155TokenBalances.filter((balance) => {
                    return Number(balance.balance) > 0;
                  })
                : item.value.erc721TokenBalances;
            })
            .map(async (tokenList) => {
              return await Promise.allSettled(
                tokenList.map(async (token) => {
                  if (token.metadata.indexStatus === 'INDEXED') {
                    return this.convertNftToTokenWithBalance(token);
                  }
                  return this.convertUnindexedToTokenWithBalance(token);
                })
              ).then((result) => {
                return result
                  .filter(
                    (
                      item
                    ): item is PromiseFulfilledResult<NftTokenWithBalance> =>
                      item.status === 'fulfilled'
                  )
                  .map((item) => {
                    return item.value;
                  });
              });
            })
        ).then((results) => {
          return results
            .filter(
              (item): item is PromiseFulfilledResult<NftTokenWithBalance[]> =>
                item.status === 'fulfilled'
            )
            .flatMap((item) => {
              return item.value;
            })
            .filter((nft) => {
              return !!nft;
            });
        });

        return {
          list: items,
          pageTokens: {
            [TokenType.ERC721]: nextPageTokenFor721 ?? '',
            [TokenType.ERC1155]: nextPageTokenFor1155 ?? '',
          },
        };
      })
      .catch((error) => {
        metadataSentryTracker.setStatus('internal_error');
        metadataSentryTracker.finish();
        sentryTracker.setStatus('internal_error');
        throw error;
      })
      .finally(() => {
        sentryTracker.finish();
      });
  }

  private convertNftToTokenWithBalanceWithMetadata(
    token: Erc721TokenBalance | Erc1155TokenBalance,
    metadata: NftMetadata
  ): NftTokenWithBalance {
    const is721 = isErc721TokenBalance(token);
    const attributes =
      (metadata.attributes || []).reduce((acc: TokenAttribute[], attr) => {
        return [
          ...acc,
          { name: attr.key ?? attr.trait_type, value: attr.value },
        ];
      }, []) ?? [];

    return {
      /**
       * Collection name doesnt come back in details of attributes
       * so not sure where this is going to come from. But for now will just
       * say unknown unless token has it eventually
       */
      collectionName: is721 ? token.name : metadata.name ?? 'Unknown',
      ...token,
      type: is721 ? TokenType.ERC721 : TokenType.ERC1155,
      logoUri: ipfsResolverWithFallback(metadata.image),
      logoSmall: metadata.image ? getSmallImageForNFT(metadata.image) : '',
      description: metadata.description ?? '',
      address: token.address,
      attributes,
      balance: is721 ? new BN(0) : new BN(token.balance),
      name: is721 ? token.name : metadata.name ?? 'Unknown',
      symbol: is721 ? token.symbol : token.metadata.symbol ?? '',
    };
  }

  private convertNftToTokenWithBalance(
    token: Erc721TokenBalance | Erc1155TokenBalance
  ): NftTokenWithBalance {
    const is721 = isErc721TokenBalance(token);

    const rawAttributes = token.metadata[is721 ? 'attributes' : 'properties'];
    const attributes = rawAttributes ? JSON.parse(rawAttributes) : [];

    return {
      /**
       * Collection name doesnt come back in details of attributes
       * so not sure where this is going to come from. But for now will just
       * say unknown unless token has it eventually
       */
      collectionName: is721 ? token.name : token.metadata.name ?? 'Unknown',
      ...token,
      type: is721 ? TokenType.ERC721 : TokenType.ERC1155,
      logoUri: ipfsResolverWithFallback(token.metadata.imageUri),
      logoSmall: token.metadata.imageUri
        ? getSmallImageForNFT(token.metadata.imageUri)
        : '',
      description: token.metadata.description ?? '',
      address: token.address,
      attributes,
      balance: is721 ? new BN(0) : new BN(token.balance),
      name: is721 ? token.name : token.metadata.name ?? 'Unknown',
      symbol: is721 ? token.symbol : token.metadata.symbol ?? '',
    };
  }
}
