import { BN } from 'bn.js';
import { Network } from '@avalabs/chains-sdk';
import { Covalent, GetAddressBalanceV2Item } from '@avalabs/covalent-sdk';
import { singleton } from 'tsyringe';
import { SettingsService } from '../../settings/SettingsService';
import { TokenType, NftTokenWithBalance, NftBalanceResponse } from '../models';
import { NFTService } from './models';
import { getSmallImageForNFT } from './utils/getSmallImageForNFT';
import { ipfsResolverWithFallback } from '@src/utils/ipsfResolverWithFallback';
import * as Sentry from '@sentry/browser';

@singleton()
export class NFTBalancesServiceCovalent implements NFTService {
  private key = process.env.COVALENT_API_KEY;
  constructor(private settingsService: SettingsService) {}

  /**
   * This will serve 2 purposes, one if Glacier is down for subnets and two
   * for eth. Covalent supposedly as good eth support so we are going to find out
   *
   * @param _chainId the chain we want NFTs for
   * @returns boolean
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async isAggregatorForChain(_chainId: number) {
    // not sure of the eth chain id sources here, I assume this is going to come
    return false;
  }

  async getNFTBalances(
    address: string,
    network: Network
  ): Promise<NftBalanceResponse> {
    const sentryTracker = Sentry.startTransaction({
      name: `NFTBalancesServiceCovalent: getNFTBalances for ${network.chainName}`,
      op: 'getNFTBalanceForNetwork',
    });
    const selectedCurrency: any = (await this.settingsService.getSettings())
      .currency;

    const balances = await new Covalent(
      network.chainId,
      this.key
    ).getAddressBalancesV2(address, true, selectedCurrency);

    const items = balances.data.items.reduce(
      (agg: NftTokenWithBalance[], data) => {
        return data.type !== 'nft'
          ? agg
          : [...agg, ...this.mapCovalentNFTData(data)];
      },
      []
    );
    sentryTracker.finish();

    return {
      list: items,
    };
  }

  private getType(supportedErc: string[]) {
    if (supportedErc.includes('erc1155')) {
      return TokenType.ERC1155;
    }
    return TokenType.ERC721;
  }

  private mapCovalentNFTData(
    item: GetAddressBalanceV2Item
  ): NftTokenWithBalance[] {
    return (
      item.nft_data?.map((nft) => {
        return {
          collectionName: item.contract_name || 'Unknown',
          tokenId: nft.token_id,
          attributes: nft.external_data.attributes?.map((attr) => ({
            name: attr.trait_type,
            value: attr.value,
          })),
          address: item.contract_address,
          type: item.supports_erc
            ? this.getType(item.supports_erc)
            : TokenType.ERC721,
          name: nft.external_data.name,
          description: nft.external_data.description,
          logoUri: ipfsResolverWithFallback(nft.external_data.image),
          logoSmall: nft.external_data.image
            ? getSmallImageForNFT(nft.external_data.image)
            : '',
          decimals: 18,
          symbol: '',
          balance: new BN(item.balance),
        };
      }) || []
    );
  }
}
