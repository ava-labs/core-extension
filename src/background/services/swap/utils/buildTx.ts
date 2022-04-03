import { resolve } from '@src/utils/promiseResolver';
import { APIError, BuildOptions, PriceString, Transaction } from 'paraswap';
import { Address, OptimalRate } from 'paraswap-core';
import { firstValueFrom } from 'rxjs';
import { paraSwap$ } from '../swap';

export async function buildTx(
  network: string,
  srcToken: Address,
  destToken: Address,
  srcAmount: PriceString,
  destAmount: PriceString,
  priceRoute: OptimalRate,
  userAddress: Address,
  partner?: string,
  partnerAddress?: string,
  partnerFeeBps?: number,
  receiver?: Address,
  options?: BuildOptions,
  srcDecimals?: number,
  destDecimals?: number,
  permit?: string,
  deadline?: string
): Promise<APIError | Transaction> {
  const [paraSwap] = await resolve(firstValueFrom(paraSwap$));

  const query = new URLSearchParams(options as Record<string, string>);
  const txURL = `${
    paraSwap.apiURL
  }/transactions/${network}/?${query.toString()}`;
  const txConfig = {
    priceRoute,
    srcToken,
    destToken,
    srcAmount,
    destAmount,
    userAddress,
    partner,
    partnerAddress,
    partnerFeeBps,
    receiver,
    srcDecimals,
    destDecimals,
    permit,
    deadline,
  };

  const response = await fetch(txURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(txConfig),
  });
  return await response.json();
}
