import { singleton } from 'tsyringe';
import { FeatureFlagService } from '../featureFlags/FeatureFlagService';
import Blockaid from '@blockaid/client';
import { ChainId, Network } from '@avalabs/chains-sdk';
import {
  EthSendTransactionParamsWithGas,
  TransactionDisplayValues,
  TransactionNft,
  TransactionToken,
  TransactionType,
} from '../wallet/handlers/eth_sendTransaction/models';
import { TransactionScanSupportedChain } from '@blockaid/client/resources';
import { TokenType } from '../balances/models';
import { NftDetails, TokenDetails, isNft, isToken } from './utils';
import { FeatureGates } from '../featureFlags/models';

@singleton()
export class BlockaidService {
  #baseUrl: string;
  #blockaid: Blockaid;

  constructor(private featureFlagService: FeatureFlagService) {
    this.#baseUrl = process.env.PROXY_URL + '/proxy/blockaid/';
    this.#blockaid = new Blockaid({
      baseURL: this.#baseUrl,
      apiKey: 'key', // Proxy API will append the actual API key, this here is just so the SDK does not complain
    });
  }

  #getChainName = (chainId: number): TransactionScanSupportedChain => {
    switch (chainId) {
      case ChainId.ETHEREUM_HOMESTEAD:
        return 'ethereum';
      case ChainId.AVALANCHE_MAINNET_ID:
        return 'avalanche';
      case 42161:
        return 'arbitrum';
      case 8453:
        return 'base';
      case 56:
        return 'bsc';
      case 137:
        return 'polygon';
      case 324:
        return 'zksync';
      case 7777777:
        return 'zora';
      case 59144:
        return 'linea';
      case 238:
        return 'blast';
      default:
        return 'unknown';
    }
  };

  parseTokenData(token: TokenDetails): TransactionToken | undefined {
    if (token.type === 'ERC20') {
      return {
        address: token.address,
        decimals: token.decimals,
        logoUri: token.logo_url,
        symbol: token.symbol || 'N/A',
        name: token.name || 'N/A',
      };
    }
    if (token.type === 'NATIVE') {
      return {
        address: token.symbol?.toLowerCase() || 'avax',
        decimals: token.decimals,
        logoUri: token.logo_url,
        symbol: token.symbol || 'N/A',
        name: token.name || 'N/A',
      };
    }
  }

  parseNftData(nft: NftDetails): TransactionNft | undefined {
    if (nft.type === 'ERC1155') {
      return {
        type: TokenType.ERC1155,
        address: nft.address,
        amount: BigInt(0),
        logoUri: nft.logo_url,
        symbol: nft.symbol,
        name: nft.name || '',
        description: '',
      };
    }
    if (nft.type === 'ERC721') {
      return {
        type: TokenType.ERC721,
        address: nft.address,
        amount: BigInt(0),
        logoUri: nft.logo_url,
        symbol: nft.symbol,
        name: nft.name || '',
        description: '',
      };
    }
    if (nft.type === 'NONERC') {
      return {
        type: TokenType.ERC721,
        address: nft.address,
        amount: BigInt(0),
        logoUri: nft.logo_url,
        symbol: nft.symbol,
        name: nft.name || '',
        description: '',
      };
    }
  }

  async transactionScan(
    tx: EthSendTransactionParamsWithGas,
    chain: Blockaid.Evm.TransactionScanSupportedChain,
    domain: string
  ) {
    if (
      !this.featureFlagService.featureFlags[
        FeatureGates.BLOCKAID_TRANSACTION_SCAN
      ]
    ) {
      return null;
    }
    return await this.#blockaid.evm.transaction.scan({
      account_address: tx.from,
      chain,
      options: ['validation', 'simulation'],
      data: {
        from: tx.from,
        to: tx.to,
        data: tx.data,
        value: tx.value,
      },
      metadata: { domain },
    });
  }

  async parseTransaction(
    domain: string,
    network: Network,
    tx: EthSendTransactionParamsWithGas
  ): Promise<TransactionDisplayValues> {
    const chain = this.#getChainName(network.chainId);
    const response = await this.transactionScan(tx, chain, domain);
    if (!response) {
      throw new Error('The transaction scanning is disabled');
    }

    const { simulation, validation } = response;
    if (simulation?.status !== 'Success') {
      throw new Error('Transaction simulation unsuccessful');
    }

    const senderAssetDiff = simulation.account_summary.assets_diffs;
    if (!senderAssetDiff) {
      throw new Error(`Unknown impact on sender's assets`);
    }

    const sendTokenList: TransactionToken[] = [];
    const receiveTokenList: TransactionToken[] = [];
    const sendNftList: TransactionNft[] = [];
    const receiveNftList: TransactionNft[] = [];

    for (const diffData of senderAssetDiff) {
      let token: TransactionToken | undefined = undefined;
      let nft: TransactionNft | undefined = undefined;
      if (isToken(diffData.asset)) {
        token = this.parseTokenData(diffData.asset);
      }
      if (isNft(diffData.asset)) {
        nft = this.parseNftData(diffData.asset);
      }

      if (diffData.in.length && (token || nft)) {
        for (const assetDiff of diffData.in) {
          let value: bigint = BigInt(0);
          if (assetDiff && 'raw_value' in assetDiff) {
            value = BigInt(assetDiff.raw_value);
          } else if (assetDiff && 'value' in assetDiff) {
            value = BigInt(assetDiff.value);
          }
          token &&
            receiveTokenList.push({
              ...token,
              usdValue: Number(assetDiff.usd_price),
              amount: value,
            });
          nft &&
            receiveNftList.push({
              ...nft,
              amount: value,
              size: diffData.in.length,
            });
        }
      }

      if (diffData.out.length && (token || nft)) {
        for (const assetDiff of diffData.out) {
          let value: bigint = BigInt(0);
          if (assetDiff && 'raw_value' in assetDiff) {
            value = BigInt(assetDiff.raw_value);
          } else if (assetDiff && 'value' in assetDiff) {
            value = BigInt(assetDiff.value);
          }
          token &&
            sendTokenList.push({
              ...token,
              usdValue: Number(assetDiff.usd_price),
              amount: value,
            });
          nft &&
            sendNftList.push({
              ...nft,
              amount: value,
              size: diffData.out.length,
            });
        }
      }
    }
    const displayValues: TransactionDisplayValues = {
      fromAddress: tx.from,
      balanceChange: {
        usdValueChange: Number(
          simulation.account_summary.total_usd_diff?.total
        ),
        sendTokenList,
        receiveTokenList,
        sendNftList,
        receiveNftList,
      },
      isMalicious: validation?.result_type === 'Malicious',
      isSuspicious:
        validation?.result_type === 'Warning' ||
        validation?.result_type === 'Error',
      preExecSuccess: simulation.status === 'Success',
      gas: {
        maxPriorityFeePerGas: tx.maxPriorityFeePerGas
          ? BigInt(tx.maxPriorityFeePerGas)
          : undefined,
        maxFeePerGas: BigInt(tx.maxFeePerGas),
        gasLimit: Number(tx.gasLimit),
        recommendedGasLimit: undefined,
      },
      abi: undefined,
      actions: [
        {
          type: TransactionType.CALL,
          fromAddress: tx.from,
          contract: {
            address: tx.to ?? '',
          },
        },
      ],
    };
    return displayValues;
  }
}
