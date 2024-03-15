import { TokenType } from '../../balances/models';
import {
  TransactionAction,
  TransactionType,
} from '@src/background/services/wallet/handlers/eth_sendTransaction/models';
import { TxAction } from '../models';
import { mapNftToTransactionNft } from './mapNftToTransactionNft';
import { mapTokenItemToTransactionToken } from './mapTokenItemToTransactionToken';

export function debankActionsToTransactionActions(
  actions: TxAction[]
): TransactionAction[] {
  return actions?.map((action) => {
    switch (action.type) {
      case 'send_token':
        return {
          type: TransactionType.SEND_TOKEN,
          fromAddress: action.from_addr,
          toAddress: action.to_addr,
          token: mapTokenItemToTransactionToken(action.token),
        };
      case 'send_nft':
        return {
          type: TransactionType.SEND_NFT,
          fromAddress: action.from_addr,
          toAddress: action.to_addr,
          nft: mapNftToTransactionNft(action.nft),
        };
      case 'approve_token':
      case 'revoke_token_approval':
        return {
          type:
            action.type === 'approve_token'
              ? TransactionType.APPROVE_TOKEN
              : TransactionType.REVOKE_TOKEN_APPROVAL,
          owner: action.owner,
          spender: {
            address: action.spender.id,
            protocol: action.spender.protocol
              ? {
                  id: action.spender.protocol.id,
                  name: action.spender.protocol.name,
                  logoUri: action.spender.protocol.logo_url,
                }
              : undefined,
          },
          token: mapTokenItemToTransactionToken(action.token),
        };
      case 'approve_nft':
      case 'revoke_nft_approval':
        return {
          type:
            action.type === 'approve_nft'
              ? TransactionType.APPROVE_NFT
              : TransactionType.REVOKE_NFT_APPROVAL,
          owner: action.owner,
          spender: {
            address: action.spender.id,
            protocol: action.spender.protocol
              ? {
                  id: action.spender.protocol.id,
                  name: action.spender.protocol.name,
                  logoUri: action.spender.protocol.logo_url,
                }
              : undefined,
          },
          token: mapNftToTransactionNft(action.nft),
        };
      case 'approve_nft_collection':
      case 'revoke_nft_collection_approval':
        return {
          type:
            action.type === 'approve_nft_collection'
              ? TransactionType.APPROVE_NFT_COLLECTION
              : TransactionType.REVOKE_NFT_COLLECTION_APPROVAL,
          owner: action.owner,
          spender: {
            address: action.spender.id,
            protocol: action.spender.protocol
              ? {
                  id: action.spender.protocol.id,
                  name: action.spender.protocol.name,
                  logoUri: action.spender.protocol.logo_url,
                }
              : undefined,
          },
          collection: {
            id: action.collection.id,
            name: action.collection.name,
            description: action.collection.description ?? '',
            address: action.collection.id,
            logoUri: action.collection.logo_url,
            type: action.collection.is_erc1155
              ? TokenType.ERC1155
              : TokenType.ERC721,
            isScam: action.collection.is_scam,
            isSuspicious: action.collection.is_suspicious,
          },
        };
      case 'cancel_tx':
        return {
          type: TransactionType.CANCEL_TX,
          fromAddress: action.from_addr,
        };
      case 'deploy_contract':
        return {
          type: TransactionType.DEPLOY_CONTRACT,
          fromAddress: action.from_addr,
        };
      case 'call':
      default:
        return {
          type: TransactionType.CALL,
          fromAddress: action.from_addr,
          toAddress: action.to_addr,
          contract: action.contract
            ? {
                address: action.contract.id,
                protocol: action.contract.protocol
                  ? {
                      id: action.contract.protocol.id,
                      name: action.contract.protocol.name,
                      logoUri: action.contract.protocol.logo_url,
                    }
                  : undefined,
              }
            : undefined,
        };
    }
  });
}
