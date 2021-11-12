import { WalletType } from '@avalabs/avalanche-wallet-sdk';
import { wallet$ } from '@avalabs/wallet-react-components';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { incrementalPromiseResolve } from '@src/utils/incrementalPromiseResolve';
import { resolve } from '@src/utils/promiseResolver';
import { APIError, ParaSwap } from 'paraswap';
import { OptimalRate } from 'paraswap-core';
import { firstValueFrom } from 'rxjs';
import Web3 from 'web3';
import { gasPrice$ } from '../../gas/gas';
import { GasPrice } from '../../gas/models';
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

  const [paraSwap, err] = await resolve(firstValueFrom(paraSwap$));
  const [wallet, walletError] = await resolve(firstValueFrom(wallet$));
  const [gasPrice, gasPriceError] = await resolve(firstValueFrom(gasPrice$));

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

  if (gasPriceError) {
    return {
      ...request,
      error: `Gas Error: ${gasPriceError}`,
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

  const contract = new (pSwap.web3Provider as Web3).eth.Contract(
    ERC20_ABI as any,
    srcToken
  );

  const [allowance, allowanceError] = await resolve(
    pSwap.getAllowance(userAddress, srcToken)
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

  const [approveTxHash, approveError] = await resolve(
    /**
     * We may need to check if the allowance is enough to cover what is trying to be sent?
     */
    (allowance as Allowance).tokenAddress
      ? (Promise.resolve([]) as any)
      : (wallet as WalletType).sendCustomEvmTx(
          (gasPrice as GasPrice).bn,
          Number(gasLimit),
          contract.methods.approve(spender, srcAmount).encodeABI(),
          srcToken
        )
  );

  if (approveError) {
    return {
      ...request,
      error: `Approve Error: ${approveError}`,
    };
  }

  const txData = pSwap.buildTx(
    srcToken,
    destToken,
    srcAmount,
    destAmount,
    priceRoute,
    userAddress,
    partner,
    partnerAddress,
    partnerFeeBps,
    receiver,
    buildOptions,
    srcDecimals,
    destDecimals,
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
      (gasPrice as GasPrice).bn,
      Number(txBuildData.gas),
      txBuildData.data,
      txBuildData.to
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
