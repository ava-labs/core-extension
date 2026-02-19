import { EnsureDefined } from './util-types';
import { DomainMetadata } from './domain-metadata';
import { RpcRequest, TokenType } from '@avalabs/vm-module-types';

export enum AvalancheChainStrings {
  AVM = 'X Chain',
  PVM = 'P Chain',
  EVM = 'C Chain',
}

export enum TransactionType {
  SEND_TOKEN = 'send_token',
  SEND_NFT = 'send_nft',
  APPROVE_TOKEN = 'approve_token',
  APPROVE_NFT = 'approve_nft',
  APPROVE_NFT_COLLECTION = 'approve_nft_collection',
  REVOKE_TOKEN_APPROVAL = 'revoke_token_approval',
  REVOKE_NFT_APPROVAL = 'revoke_nft_approval',
  REVOKE_NFT_COLLECTION_APPROVAL = 'revoke_nft_collection_approval',
  CANCEL_TX = 'cancel_tx',
  DEPLOY_CONTRACT = 'deploy_contract',
  SWAP = 'swap',
  ADD_LIQUIDITY = 'add_liquidity',
  CALL = 'call',
}

export interface TransactionToken {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
  logoUri?: string;

  amount?: bigint;
  usdValue?: number;
  usdPrice?: number;

  isScam?: boolean;
  isInfinity?: boolean;
  isSuspicious?: boolean;
}

export interface TransactionNft {
  type: TokenType.ERC721 | TokenType.ERC1155;
  address: string;
  name: string;
  description: string;
  logoUri?: string;
  symbol?: string;

  amount: bigint;

  collection?: {
    name: string;
    description: string | null;
    logoUri: string;
  };

  isScam?: boolean;
  isSuspicious?: boolean;
  size?: number;
}

export type TransactionAction =
  | {
      type: TransactionType.SEND_TOKEN;
      fromAddress: string;
      toAddress: string;
      token: TransactionToken;
    }
  | {
      type: TransactionType.SEND_NFT;
      fromAddress: string;
      toAddress: string;
      nft: TransactionNft;
    }
  | {
      type:
        | TransactionType.APPROVE_TOKEN
        | TransactionType.REVOKE_TOKEN_APPROVAL;
      spender: {
        address: string;
        protocol?: {
          id: string;
          name: string;
          logoUri: string;
        };
      };
      token: TransactionToken;
      customSpendLimit?: bigint;
    }
  | {
      type: TransactionType.APPROVE_NFT | TransactionType.REVOKE_NFT_APPROVAL;
      owner: string;
      spender: {
        address: string;
        protocol?: {
          id: string;
          name: string;
          logoUri: string;
        };
      };
      token: TransactionNft;
    }
  | {
      type:
        | TransactionType.APPROVE_NFT_COLLECTION
        | TransactionType.REVOKE_NFT_COLLECTION_APPROVAL;
      owner: string;
      spender: {
        address: string;
        protocol?: {
          id: string;
          name: string;
          logoUri: string;
        };
      };
      collection: {
        id: string;
        name: string;
        description: string;
        address: string;
        logoUri: string;
        type: TokenType.ERC721 | TokenType.ERC1155;

        isScam?: boolean;
        isSuspicious?: boolean;
      };
    }
  | {
      type: TransactionType.CANCEL_TX;
      fromAddress: string;
    }
  | {
      type: TransactionType.DEPLOY_CONTRACT;
      fromAddress: string;
    }
  | {
      type: TransactionType.CALL;
      fromAddress: string;
      contract?: {
        address: string;
        protocol?: {
          id: string;
          name: string;
          logoUri: string;
        };
      };
    }
  | {
      type: TransactionType.ADD_LIQUIDITY | TransactionType.SWAP;
      fromAddress: string;
      contract?: {
        address: string;
      };
    };

export interface TransactionDisplayValues {
  fromAddress: string;

  abi?: {
    func: string;
    params: unknown[];
  };

  actions: TransactionAction[];

  gas: {
    maxPriorityFeePerGas?: bigint;
    maxFeePerGas: bigint;
    gasLimit: number;
    recommendedGasLimit?: number;
  };

  balanceChange?: {
    usdValueChange?: number;
    sendTokenList: TransactionToken[];
    receiveTokenList: TransactionToken[];
    sendNftList: TransactionNft[];
    receiveNftList: TransactionNft[];
  };

  preExecSuccess?: boolean;
  isMalicious?: boolean;
  isSuspicious?: boolean;
}

export interface Transaction {
  site?: DomainMetadata;
  method: string;
  chainId: string;
  txParams: EnsureDefined<EthSendTransactionParamsWithGas, 'chainId'>;
  displayValues: TransactionDisplayValues;
  displayOptions?: TxDisplayOptions;
}
export interface EthSendTransactionParams {
  from: string;
  to?: string;
  value?: string | bigint;
  data?: string;
  gas?: number;
  gasPrice?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  chainId?: string;
  gasLimit?: string;
  nonce?: string;
  type?: number;
}

export function isTxParams(
  params: Partial<EthSendTransactionParams>,
): params is EthSendTransactionParams {
  return !!params.from;
}

export interface EthSendTransactionParamsWithGas
  extends EthSendTransactionParams {
  type: number;
  gasLimit: string;
  maxFeePerGas: string;
}

export type TxDisplayOptions = {
  customApprovalScreenTitle?: string;
  contextInformation?: {
    title: string;
    notice?: string;
  };
};

export enum TransactionStatusEvents {
  PENDING = 'TransactionStatusEvents:pending',
  CONFIRMED = 'TransactionStatusEvents:confirmed',
  REVERTED = 'TransactionStatusEvents:reverted',
}

export interface TransactionStatusInfo {
  txHash: string;
  request: RpcRequest;
}
