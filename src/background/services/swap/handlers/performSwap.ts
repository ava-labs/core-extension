import { ChainId } from '@avalabs/chains-sdk';
import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { incrementalPromiseResolve } from '@src/utils/incrementalPromiseResolve';
import { resolve } from '@src/utils/promiseResolver';
import Big from 'big.js';
import { BN } from 'bn.js';
import { BigNumber, ethers } from 'ethers';
import { OptimalRate } from 'paraswap-core';
import { APIError, ETHER_ADDRESS, Transaction } from 'paraswap';
import { injectable } from 'tsyringe';
import { AccountsService } from '../../accounts/AccountsService';
import { NetworkService } from '../../network/NetworkService';
import { NetworkFeeService } from '../../networkFee/NetworkFeeService';
import { WalletService } from '../../wallet/WalletService';
import { SwapService } from '../SwapService';

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
    gasPrice: BigNumber,
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
    private accountsService: AccountsService
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
    // no need to approve AVAX
    if (srcToken !== activeNetwork.networkToken.symbol) {
      const contract = new ethers.Contract(
        srcTokenAddress,
        ERC20.abi,
        provider
      );

      const [allowance, allowanceError] = await resolve(
        contract.allowance(userAddress, spender)
      );

      if (allowanceError) {
        return {
          ...request,
          error: `Allowance Error: ${allowanceError}`,
        };
      }

      if ((allowance as BigNumber).lt(sourceAmount)) {
        const [approveGasLimit] = await resolve(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          contract.estimateGas.approve!(spender, sourceAmount)
        );

        if (!(allowance as BigNumber).gte(sourceAmount)) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const { data } = await contract.populateTransaction.approve!(
            spender,
            sourceAmount
          );
          const [signedTx, signError] = await resolve(
            this.walletService.sign(
              {
                nonce: await provider.getTransactionCount(userAddress),
                chainId: ChainId.AVALANCHE_MAINNET_ID,
                gasPrice: defaultGasPrice?.low,
                gasLimit: approveGasLimit
                  ? approveGasLimit.toNumber()
                  : Number(gasLimit),
                data,
                to: srcTokenAddress,
              },
              request.tabId
            )
          );

          if (signError) {
            return {
              ...request,
              error: `Approve Error: ${signError}`,
            };
          }

          const [hash, approveError] = await resolve(
            this.networkService.sendTransaction(signedTx)
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

    const [signedTx, signError] = await resolve(
      this.walletService.sign(
        {
          nonce: await provider.getTransactionCount(userAddress),
          chainId: ChainId.AVALANCHE_MAINNET_ID,
          gasPrice: BigNumber.from(gasPrice ? gasPrice : defaultGasPrice?.low),
          gasLimit: Number(txBuildData.gas),
          data: txBuildData.data,
          to: txBuildData.to,
          value:
            srcToken === activeNetwork.networkToken.symbol
              ? `0x${new BN(sourceAmount).toString('hex')}`
              : undefined, // AVAX value needs to be sent with the transaction
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
      this.networkService.sendTransaction(signedTx)
    );

    if (txError) {
      return {
        ...request,
        error: `Tx Error: ${txError}`,
      };
    }

    return {
      ...request,
      result: {
        swapTxHash,
        approveTxHash,
      },
    };
  };
}
