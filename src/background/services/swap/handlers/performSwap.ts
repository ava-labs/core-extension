import { ChainId } from '@avalabs/chains-sdk';
import browser from 'webextension-polyfill';
import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { incrementalPromiseResolve } from '@src/utils/incrementalPromiseResolve';
import { resolve } from '@src/utils/promiseResolver';
import { findToken } from '@src/background/utils/findToken';
import Big from 'big.js';
import { BN } from 'bn.js';
import { ethers } from 'ethers';
import { OptimalRate } from 'paraswap-core';
import { APIError, ETHER_ADDRESS, Transaction } from 'paraswap';
import { injectable } from 'tsyringe';
import { AccountsService } from '../../accounts/AccountsService';
import { NetworkService } from '../../network/NetworkService';
import { NetworkFeeService } from '../../networkFee/NetworkFeeService';
import { WalletService } from '../../wallet/WalletService';
import { SwapService } from '../SwapService';
import { AnalyticsServicePosthog } from '../../analytics/AnalyticsServicePosthog';
import i18next from 'i18next';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SWAP_PERFORM,
  {
    swapTxHash: string;
    approveTxHash: string;
  },
  [
    srcToken: string,
    destToken: string,
    srcDecimals: number,
    destDecimals: number,
    srcAmount: string,
    priceRoute: OptimalRate,
    destAmount: string,
    gasLimit: number,
    gasPrice: bigint,
    slippage: number
  ]
>;

@injectable()
export class PerformSwapHandler implements HandlerType {
  method = ExtensionRequest.SWAP_PERFORM as const;

  constructor(
    private swapService: SwapService,
    private networkService: NetworkService,
    private walletService: WalletService,
    private networkFeeService: NetworkFeeService,
    private accountsService: AccountsService,
    private analyticsPosthogService: AnalyticsServicePosthog
  ) {}

  handle: HandlerType['handle'] = async (request) => {
    const [
      srcToken,
      destToken,
      srcDecimals,
      destDecimals,
      srcAmount,
      priceRoute,
      destAmount,
      gasLimit,
      gasPrice,
      slippage,
    ] = request.params || [];

    if (!srcToken) {
      return {
        ...request,
        error: 'no source token on request',
      };
    }

    if (!destToken) {
      return {
        ...request,
        error: 'no destination token on request',
      };
    }

    if (!srcAmount) {
      return {
        ...request,
        error: 'no amount on request',
      };
    }

    if (!srcDecimals) {
      return {
        ...request,
        error: 'request requires the decimals for source token',
      };
    }

    if (!destDecimals) {
      return {
        ...request,
        error: 'request requires the decimals for destination token',
      };
    }

    if (!destAmount) {
      return {
        ...request,
        error: 'request requires a destAmount expected for destination token',
      };
    }

    if (!priceRoute) {
      return {
        ...request,
        error: 'request requires the paraswap priceRoute',
      };
    }

    if (!gasLimit) {
      return {
        ...request,
        error: 'request requires gas limit from paraswap response',
      };
    }

    const activeNetwork = this.networkService.activeNetwork;
    if (!activeNetwork || activeNetwork.isTestnet) {
      return {
        ...request,
        error: `Network Init Error: Wrong network`,
      };
    }

    const srcTokenAddress =
      srcToken === activeNetwork.networkToken.symbol ? ETHER_ADDRESS : srcToken;
    const destTokenAddress =
      destToken === activeNetwork.networkToken.symbol
        ? ETHER_ADDRESS
        : destToken;
    const defaultGasPrice = await this.networkFeeService.getNetworkFee();

    if (!this.accountsService.activeAccount?.addressC) {
      return {
        ...request,
        error: `Wallet Error: address not defined`,
      };
    }

    const buildOptions = undefined,
      partnerAddress = undefined,
      partner = 'Avalanche',
      userAddress = this.accountsService.activeAccount?.addressC,
      receiver = undefined,
      permit = undefined,
      deadline = undefined,
      partnerFeeBps = undefined;

    const spender = await this.swapService.getParaswapSpender();

    let approveTxHash;

    const minAmount = new Big(priceRoute.destAmount)
      .times(1 - slippage / 100)
      .toFixed(0);

    const maxAmount = new Big(srcAmount).times(1 + slippage / 100).toFixed(0);

    //TODO: it may fail when we want to swap erc20 tokens -> investigate
    const sourceAmount = priceRoute.side === 'SELL' ? srcAmount : maxAmount;

    const destinationAmount =
      priceRoute.side === 'SELL' ? minAmount : priceRoute.destAmount;

    const provider = await this.networkService.getAvalancheProvider();
    let nonce = await provider.getTransactionCount(userAddress);

    // no need to approve AVAX
    if (srcToken !== activeNetwork.networkToken.symbol) {
      const contract = new ethers.Contract(
        srcTokenAddress,
        ERC20.abi,
        provider
      );

      if (!contract.allowance) {
        return {
          ...request,
          error: `Allowance Conract Error`,
        };
      }

      const [allowance, allowanceError] = await resolve(
        contract.allowance(userAddress, spender)
      );

      if (allowanceError) {
        return {
          ...request,
          error: `Allowance Error: ${allowanceError}`,
        };
      }

      if (allowance < sourceAmount) {
        const [approveGasLimit] = await resolve(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          contract.approve!.estimateGas(spender, sourceAmount)
        );

        if (allowance < sourceAmount) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const { data } = await contract.approve!.populateTransaction(
            spender,
            sourceAmount
          );
          const [allowanceSignResult, signError] = await resolve(
            this.walletService.sign(
              {
                nonce,
                chainId: ChainId.AVALANCHE_MAINNET_ID,
                gasPrice: defaultGasPrice?.low.maxFee,
                gasLimit: approveGasLimit
                  ? Number(approveGasLimit)
                  : Number(gasLimit),
                data,
                to: srcTokenAddress,
                type: 0, //type: The EIP-2718 type of this transaction envelope, or null for to use the network default. To force using a lagacy transaction without an envelope, use type 0.
              },
              request.tabId
            )
          );

          nonce++;

          if (signError) {
            return {
              ...request,
              error: `Approve Error: ${signError}`,
            };
          }

          const [hash, approveError] = await resolve(
            this.networkService.sendTransaction(allowanceSignResult)
          );

          if (approveError) {
            return {
              ...request,
              error: `Approve Error: ${approveError}`,
            };
          }

          approveTxHash = hash;
        } else {
          approveTxHash = [];
        }
      }
    }

    function checkForErrorsInResult(result: Transaction | APIError) {
      return (
        (result as APIError).message === 'Server too busy' ||
        // paraswap returns responses like this: {error: 'Not enough 0x4f60a160d8c2dddaafe16fcc57566db84d674…}
        // when they are too slow to detect the approval
        (result as any).error
      );
    }

    const [txBuildData, txBuildDataError] = await resolve(
      incrementalPromiseResolve(
        () =>
          this.swapService.buildTx(
            ChainId.AVALANCHE_MAINNET_ID.toString(),
            srcTokenAddress,
            destTokenAddress,
            sourceAmount,
            destinationAmount,
            priceRoute,
            userAddress,
            partner,
            partnerAddress,
            partnerFeeBps,
            receiver,
            buildOptions,
            activeNetwork.networkToken.symbol === srcToken ? 18 : srcDecimals,
            activeNetwork.networkToken.symbol === destToken ? 18 : destDecimals,
            permit,
            deadline
          ),
        checkForErrorsInResult,
        0,
        10
      )
    );

    if (txBuildDataError) {
      return {
        ...request,
        error: `Data Error: ${txBuildDataError}`,
      };
    }

    const [signResult, signError] = await resolve(
      this.walletService.sign(
        {
          nonce,
          chainId: ChainId.AVALANCHE_MAINNET_ID,
          gasPrice: gasPrice ? gasPrice : defaultGasPrice?.low.maxFee,
          gasLimit: Number(txBuildData.gas),
          data: txBuildData.data,
          to: txBuildData.to,
          value:
            srcToken === activeNetwork.networkToken.symbol
              ? `0x${new BN(sourceAmount).toString('hex')}`
              : undefined, // AVAX value needs to be sent with the transaction
          type: 0, //type: The EIP-2718 type of this transaction envelope, or null for to use the network default. To force using a lagacy transaction without an envelope, use type 0.
        },
        request.tabId
      )
    );

    if (signError) {
      return {
        ...request,
        error: `Tx Error: ${signError}`,
      };
    }

    const [swapTxHash, txError] = await resolve(
      this.networkService.sendTransaction(signResult)
    );

    if (txError) {
      return {
        ...request,
        error: `Tx Error: ${txError}`,
      };
    }

    provider.waitForTransaction(swapTxHash).then(async (tx) => {
      const isSuccessful = tx && tx.status === 1;

      this.analyticsPosthogService.captureEncryptedEvent({
        name: isSuccessful ? 'SwapSuccessful' : 'SwapFailed',
        windowId: crypto.randomUUID(),
        properties: {
          address: userAddress,
          txHash: swapTxHash,
          chainId: ChainId.AVALANCHE_MAINNET_ID,
        },
      });

      const srcAsset = await findToken(srcToken);
      const destAsset = await findToken(destToken);
      const srcAssetAmount = new Big(srcAmount)
        .div(10 ** srcDecimals)
        .toString();
      const destAssetAmount = new Big(destAmount)
        .div(10 ** destDecimals)
        .toString();

      browser.notifications.create({
        type: 'basic',
        title: isSuccessful
          ? i18next.t('Swap transaction succeeded! 🎉')
          : i18next.t('Swap transaction failed! ❌'),
        iconUrl: '../../../../images/icon-256.png',
        priority: 2,
        message: isSuccessful
          ? i18next.t(
              'Successfully swapped {{srcAmount}} {{srcToken}} to {{destAmount}} {{destToken}}',
              {
                srcAmount: srcAssetAmount,
                destAmount: destAssetAmount,
                srcToken: srcAsset.symbol,
                destToken: destAsset.symbol,
              }
            )
          : i18next.t(
              'Could not swap {{srcAmount}} {{srcToken}} to {{destAmount}} {{destToken}}',
              {
                srcToken: srcAsset.symbol,
                destToken: destAsset.symbol,
                srcAmount: srcAssetAmount,
                destAmount: destAssetAmount,
              }
            ),
      });
    });

    return {
      ...request,
      result: {
        swapTxHash,
        approveTxHash,
      },
    };
  };
}
