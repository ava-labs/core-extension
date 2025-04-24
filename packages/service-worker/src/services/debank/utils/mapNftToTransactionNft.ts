import { TokenType } from '@avalabs/vm-module-types';
import { TransactionNft } from '../../wallet/handlers/eth_sendTransaction/models';
import { DebankNFTItem } from '@core/types/src/models';

export const mapNftToTransactionNft = (t: DebankNFTItem): TransactionNft => ({
  type: t.is_erc1155 ? TokenType.ERC1155 : TokenType.ERC721,
  address: t.contract_id,
  name: t.name,
  description: t.description,
  logoUri: t.thumbnail_url || t.detail_url,
  symbol: t.symbol,

  amount: BigInt(t.amount ?? 0),

  collection: t.collection
    ? {
        name: t.collection?.name,
        description: t.collection.description,
        logoUri: t.collection.logo_url,
      }
    : undefined,

  isScam: t.collection?.is_scam,
  isSuspicious: t.collection?.is_suspicious,
});
