import { singleton } from 'tsyringe';
import { FeatureFlagService } from '../featureFlags/FeatureFlagService';
import Blockaid from '@blockaid/client';
import { Network } from '@avalabs/core-chains-sdk';
import {
  EthSendTransactionParamsWithGas,
  TransactionAction,
  TransactionDisplayValues,
  TransactionNft,
  TransactionToken,
  TransactionType,
} from '../wallet/handlers/eth_sendTransaction/models';
import { TokenType } from '../balances/models';
import {
  NftDetails,
  TokenDetails,
  getValidationResultType,
  isNft,
  isToken,
} from './utils';
import { FeatureGates } from '../featureFlags/models';
import { JsonRpcRequestPayload } from '@src/background/connections/dAppConnection/models';
import { MessageType } from '../messages/models';

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

  async jsonRPCScan(
    chainId: string,
    from: string,
    request: JsonRpcRequestPayload<MessageType, any[]>
  ) {
    if (
      !this.featureFlagService.featureFlags[FeatureGates.BLOCKAID_JSONRPC_SCAN]
    ) {
      return null;
    }
    try {
      const result = await this.#blockaid.evm.jsonRpc.scan({
        chain: chainId,
        options: ['validation', 'simulation'],
        account_address: from,
        data: { method: request.method, params: request.params },
        metadata: { domain: request.site?.domain || '' },
      });
      return result;
    } catch (e) {
      console.error('Error: ', e);
      return null;
    }
  }

  async transactionScan(
    tx: EthSendTransactionParamsWithGas,
    chainId: string,
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
      chain: chainId,
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

  #collectTokenLists(senderAssetDiff: Blockaid.Evm.AssetDiff[]) {
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
    return { sendTokenList, receiveTokenList, sendNftList, receiveNftList };
  }

  #parseTransactionAction(
    exposures: Blockaid.Evm.AddressAssetExposure[],
    txFrom: string
  ) {
    const actions: TransactionAction[] = [];

    for (const exposure of exposures) {
      let token: TransactionToken | undefined = undefined;
      let nft: TransactionNft | undefined = undefined;
      if (isToken(exposure.asset)) {
        token = this.parseTokenData(exposure.asset);
      }
      if (isNft(exposure.asset)) {
        nft = this.parseNftData(exposure.asset);
      }
      for (const spenderId in exposure.spenders) {
        const spender = exposure.spenders[spenderId];
        if (spender && 'approval' in spender && token) {
          actions.push({
            type: TransactionType.APPROVE_TOKEN,
            spender: {
              address: spenderId,
            },
            token: { ...token, amount: BigInt(spender.approval) },
          });
        }
        if (spender && 'approval' in spender && nft) {
          actions.push({
            type: TransactionType.APPROVE_NFT,
            owner: txFrom,
            spender: {
              address: spenderId,
            },
            token: { ...nft, amount: BigInt(spender.approval) },
          });
        }
      }
    }
    return { actions };
  }

  async parseTransaction(
    domain: string,
    network: Network,
    tx: EthSendTransactionParamsWithGas
  ): Promise<TransactionDisplayValues> {
    const response = await this.transactionScan(
      tx,
      network.chainId.toString(),
      domain
    );

    if (!response) {
      throw new Error('The transaction scanning is disabled');
    }

    const { simulation, validation } = response;
    if (simulation?.status !== 'Success') {
      throw new Error('Transaction simulation unsuccessful');
    }

    const senderAssetDiff = simulation.account_summary.assets_diffs;
    const { sendTokenList, receiveTokenList, sendNftList, receiveNftList } =
      this.#collectTokenLists(senderAssetDiff);

    let actions: TransactionAction[] = [];
    if (
      !sendTokenList.length &&
      !receiveTokenList.length &&
      !sendNftList.length &&
      !receiveNftList.length
    ) {
      const parsedData = this.#parseTransactionAction(
        simulation.account_summary.exposures,
        tx.from
      );
      actions = parsedData.actions;
    }

    const displayValues: TransactionDisplayValues = {
      fromAddress: tx.from,
      balanceChange: {
        usdValueChange: Number(
          simulation.account_summary.total_usd_diff?.total
        ),
        sendTokenList: [...sendTokenList],
        receiveTokenList,
        sendNftList: [...sendNftList],
        receiveNftList,
      },
      isMalicious: getValidationResultType(validation).isMalicious,
      isSuspicious: getValidationResultType(validation).isSuspicious,
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
      actions: actions.length
        ? actions
        : [
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
