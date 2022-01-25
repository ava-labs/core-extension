import { WalletType } from '@avalabs/avalanche-wallet-sdk';
import { AVAX_TOKEN, wallet$ } from '@avalabs/wallet-react-components';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { incrementalPromiseResolve } from '@src/utils/incrementalPromiseResolve';
import { resolve } from '@src/utils/promiseResolver';
import { APIError, ParaSwap } from 'paraswap';
import { SwapSide } from 'paraswap';
import { OptimalRate } from 'paraswap-core';
import { firstValueFrom } from 'rxjs';
import { paraSwap$ } from '../swap';

const SERVER_BUSY_ERROR = 'Server too busy';

export async function getSwapRate(request: ExtensionConnectionMessage) {
  const [srcToken, srcDecimals, destToken, destDecimals, srcAmount, swapSide] =
    request.params || [];

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

  const [paraSwap, err] = await resolve(firstValueFrom(paraSwap$));
  const [wallet, walletError] = await resolve(firstValueFrom(wallet$));

  if (err) {
    return {
      ...request,
      error: err,
    };
  }

  if (walletError) {
    return {
      ...request,
      error: walletError,
    };
  }

  const optimalRates = (paraSwap as ParaSwap).getRate(
    srcToken,
    destToken,
    srcAmount,
    (wallet as WalletType).getAddressC(),
    (swapSide as SwapSide) || SwapSide.SELL,
    {
      partner: 'Avalanche',
    },
    AVAX_TOKEN.symbol === srcToken ? 18 : srcDecimals,
    AVAX_TOKEN.symbol === destToken ? 18 : destDecimals
  );

  function checkForErrorsInResult(result: OptimalRate | APIError) {
    return (result as APIError).message === SERVER_BUSY_ERROR;
  }

  const result = await incrementalPromiseResolve<OptimalRate | APIError>(
    () => optimalRates,
    checkForErrorsInResult
  );

  const destAmount = result.destAmount;

  return {
    ...request,
    result: {
      optimalRate: result,
      destAmount,
    },
  };
}

export const GetSwapRateRequest: [ExtensionRequest, ConnectionRequestHandler] =
  [ExtensionRequest.SWAP_GET_RATE, getSwapRate];
