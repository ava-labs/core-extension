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
import { avaxFrom18To9, avaxFrom9To18 } from '../utils/convertAvaxDenomination';

const SERVER_BUSY_ERROR = 'Server too busy';

export async function getSwapRate(request: ExtensionConnectionMessage) {
  const [srcToken, srcDecimals, destToken, destDecimals, srcAmount] =
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

  // Paraswap uses AVAX with denomination of 18 while the wallet uses denomination 9
  // convert value to denomination of 18
  let amount = srcAmount;
  if (AVAX_TOKEN.symbol === srcToken) {
    amount = avaxFrom9To18(srcAmount);
  }

  const optimalRates = (paraSwap as ParaSwap).getRate(
    srcToken,
    destToken,
    amount,
    (wallet as WalletType).getAddressC(),
    SwapSide.SELL,
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

  // if destination token is AVAX cut the last 9 digits to get it to denomination of 9
  let destAmount = result.destAmount;
  if (destToken === AVAX_TOKEN.symbol && result.destAmount) {
    destAmount = avaxFrom18To9(result.destAmount);
  }

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
