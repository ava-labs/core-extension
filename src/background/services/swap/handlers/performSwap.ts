import { WalletType, BN, Big } from '@avalabs/avalanche-wallet-sdk';
import { AVAX_TOKEN, wallet$ } from '@avalabs/wallet-react-components';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { incrementalPromiseResolve } from '@src/utils/incrementalPromiseResolve';
import { resolve } from '@src/utils/promiseResolver';
import { APIError, ParaSwap, ETHER_ADDRESS } from 'paraswap';
import { OptimalRate } from 'paraswap-core';
import { firstValueFrom } from 'rxjs';
import Web3 from 'web3';
import { gasPrice$ } from '../../gas/gas';
import { paraSwap$ } from '../swap';
import ERC20_ABI from '../../../../contracts/erc20.abi.json';
import { Allowance } from 'paraswap/build/types';

const SERVER_BUSY_ERROR = 'Server too busy';

export async function performSwap(request: ExtensionConnectionMessage) {
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

  const srcTokenAddress =
    srcToken === AVAX_TOKEN.symbol ? ETHER_ADDRESS : srcToken;
  const destTokenAddress =
    destToken === AVAX_TOKEN.symbol ? ETHER_ADDRESS : destToken;
  const [paraSwap, err] = await resolve(firstValueFrom(paraSwap$));
  const [wallet, walletError] = await resolve(firstValueFrom(wallet$));
  const [defaultGasPrice, defaultGasPriceError] = await resolve(
    firstValueFrom(gasPrice$)
  );

  if (err) {
    return {
      ...request,
      error: `Paraswap Init Error: ${err}`,
    };
  }

  const pSwap = paraSwap as ParaSwap;

  if (walletError) {
    return {
      ...request,
      error: `Wallet Error: ${walletError}`,
    };
  }

  if (defaultGasPriceError) {
    return {
      ...request,
      error: `Gas Error: ${defaultGasPriceError}`,
    };
  }

  const buildOptions = undefined,
    partnerAddress = undefined,
    partner = 'Avalanche',
    userAddress = (wallet as WalletType).getAddressC(),
    receiver = undefined,
    permit = undefined,
    deadline = undefined,
    partnerFeeBps = undefined;

  const spender = await pSwap.getTokenTransferProxy();

  let approveTxHash;

  const minAmount = new Big(priceRoute.destAmount)
    .times(1 - slippage / 100)
    .toFixed(0);

  const maxAmount = new Big(srcAmount).times(1 + slippage / 100).toFixed(0);

  //TODO: it may fail when we want to swap erc20 tokens -> investigate
  const sourceAmount = priceRoute.side === 'SELL' ? srcAmount : maxAmount;

  const destinationAmount =
    priceRoute.side === 'SELL' ? minAmount : priceRoute.destAmount;

  // no need to approve AVAX
  if (srcToken !== AVAX_TOKEN.symbol) {
    const contract = new (pSwap.web3Provider as Web3).eth.Contract(
      ERC20_ABI as any,
      srcTokenAddress
    );

    const [allowance, allowanceError] = await resolve(
      pSwap.getAllowance(userAddress, srcTokenAddress)
    );

    if (
      allowanceError ||
      (!!(allowance as APIError).message &&
        (allowance as APIError).message !== 'Not Found')
    ) {
      return {
        ...request,
        error: `Allowance Error: ${
          allowanceError ?? (allowance as APIError).message
        }`,
      };
    }

    const [approveHash, approveError] = await resolve(
      /**
       * We may need to check if the allowance is enough to cover what is trying to be sent?
       */
      (allowance as Allowance).tokenAddress
        ? (Promise.resolve([]) as any)
        : (wallet as WalletType).sendCustomEvmTx(
            defaultGasPrice.bn,
            Number(gasLimit),
            contract.methods.approve(spender, sourceAmount).encodeABI(),
            srcTokenAddress
          )
    );

    if (approveError) {
      return {
        ...request,
        error: `Approve Error: ${approveError}`,
      };
    }

    approveTxHash = approveHash;
  }

  const txData = pSwap.buildTx(
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
    AVAX_TOKEN.symbol === srcToken ? 18 : srcDecimals,
    AVAX_TOKEN.symbol === destToken ? 18 : destDecimals,
    permit,
    deadline
  );

  function checkForErrorsInResult(result: OptimalRate | APIError) {
    return (result as APIError).message === SERVER_BUSY_ERROR;
  }

  const [txBuildData, txBuildDataError] = await resolve(
    incrementalPromiseResolve(() => txData, checkForErrorsInResult)
  );

  if (txBuildDataError) {
    return {
      ...request,
      error: `Data Error: ${txBuildDataError}`,
    };
  }

  const [swapTxHash, txError] = await resolve(
    (wallet as WalletType).sendCustomEvmTx(
      gasPrice.bn ? new BN(gasPrice.bn, 'hex') : defaultGasPrice.bn,
      Number(txBuildData.gas),
      txBuildData.data,
      txBuildData.to,
      srcToken === AVAX_TOKEN.symbol
        ? `0x${new BN(sourceAmount).toString('hex')}`
        : undefined // AVAX value needs to be sent with the transaction
    )
  );

  if (txError) {
    return {
      ...request,
      error: `Tx Error: ${txError}`,
    };
  }
  /**
   * Doing this to reset the contracts permissions on using the users funds
   */
  // const [, approveResetError] = await resolve(
  //   pSwap.approveToken('0', userAddress, srcToken)
  // );

  // if (approveResetError) {
  //   return {
  //     ...request,
  //     error: `Reset Approve Error: ${approveResetError}`,
  //   };
  // }

  return {
    ...request,
    result: {
      swapTxHash,
      approveTxHash,
    },
  };
}

export const PerformSwapRequest: [ExtensionRequest, ConnectionRequestHandler] =
  [ExtensionRequest.SWAP_PERFORM, performSwap];
