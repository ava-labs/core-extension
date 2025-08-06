import { z } from 'zod';
import { MARKR_EVM_PARTNER_ID } from '../constants';
import { Account, NetworkWithCaipId, SwapErrorCode } from '@core/types';
import { fetchAndVerify } from '@core/common';
import { resolve } from '@avalabs/core-utils-sdk';
import { swapError } from '../swap-utils';
import { MarkrQuote, MarkrTransaction } from '../models';

/**
 * Expo fetch is used to fetch the swap rate stream from the Markr orchestrator
 * since react native fetch, or axios, does not support streaming.
 * The stream is a continuous stream of data, so we need to process it in chunks.
 * The data is sent in the following format:
 *
 * data:{
 *  "uuid":"1234567890",
 *  "aggregator":{"id":"odos","name":"Odos"},
 *  "tokenIn":"0x0000000000000000000000000000000000000000",
 *  "tokenInDecimals":18,
 *  "amountIn":"1000000000000000000",
 *  "tokenOut":"0x0000000000000000000000000000000000000000",
 *  "tokenOutDecimals":18,
 *  "amountOut":"1000000000000000000",
 *  "done":false
 * }
 *
 * done: true means the quote is done and we need to stop the stream.
 *
 * NOTE: Markr Team is going to publish their own SDK for the orchestrator,
 * so we will be able to use it directly in the future.
 */

const ORCHESTRATOR_URL = 'https://proxy-api.avax.network/proxy/markr';
const DATA_PREFIX = 'data:';
const NEWLINE = '\n';

// Utility functions - pure functions that don't depend on instance state
const parseReceivedData = (data: string): MarkrQuote => {
  try {
    return JSON.parse(data.slice(DATA_PREFIX.length).trim());
  } catch (error) {
    console.error('Invalid quote data received', error);
    throw new Error('Invalid quote data received');
  }
};

const isBetterQuote = (
  current: MarkrQuote,
  best: MarkrQuote | null,
): boolean => {
  if (!best) return true;
  if (!current.amountOut) return false;
  return (
    BigInt(current.amountOut) > BigInt(best.amountOut ?? '0') || !!current.done
  );
};

// Helper function to sort quotes by amountOut in descending order
const sortQuotesByAmountOut = (quotes: MarkrQuote[]): MarkrQuote[] => {
  return [...quotes].sort((a, b) => {
    const amountA = BigInt(a.amountOut || '0');
    const amountB = BigInt(b.amountOut || '0');
    return amountB > amountA ? 1 : amountB < amountA ? -1 : 0;
  });
};

const processEvent = (
  eventBuffer: string,
  best: MarkrQuote | null,
  allQuotes: MarkrQuote[],
  onUpdate: (update: MarkrQuote[]) => void,
): { best: MarkrQuote | null; allQuotes: MarkrQuote[] } => {
  if (!eventBuffer.startsWith(DATA_PREFIX)) return { best, allQuotes };

  const data = parseReceivedData(eventBuffer);
  if (data.done) return { best, allQuotes };

  // Add the new quote to all quotes array
  const newAllQuotes = [...allQuotes, data];

  if (isBetterQuote(data, best)) {
    onUpdate(sortQuotesByAmountOut(newAllQuotes));
    return { best: data, allQuotes: newAllQuotes };
  } else {
    // Still update with all quotes even if it's not the best
    onUpdate(sortQuotesByAmountOut(newAllQuotes));
    return { best, allQuotes: newAllQuotes };
  }
};

const processStreamChunk = (
  buffer: string,
  eventBuffer: string,
  best: MarkrQuote | null,
  allQuotes: MarkrQuote[],
  onUpdate: (update: MarkrQuote[]) => void,
): {
  newBuffer: string;
  newEvent: string;
  newBest: MarkrQuote | null;
  newAllQuotes: MarkrQuote[];
} => {
  const nl = buffer.indexOf(NEWLINE);
  if (nl === -1)
    return {
      newBuffer: buffer,
      newEvent: eventBuffer,
      newBest: best,
      newAllQuotes: allQuotes,
    };

  const line = buffer.slice(0, nl);
  const newBuffer = buffer.slice(nl + 1);

  if (line === '') {
    const result = processEvent(eventBuffer, best, allQuotes, onUpdate);
    return {
      newBuffer,
      newEvent: '',
      newBest: result.best,
      newAllQuotes: result.allQuotes,
    };
  }

  return {
    newBuffer,
    newEvent: eventBuffer + line,
    newBest: best,
    newAllQuotes: allQuotes,
  };
};

interface GetSwapRateStreamParams {
  fromTokenAddress: string;
  fromTokenDecimals: number;
  toTokenAddress: string;
  toTokenDecimals: number;
  amount: string;
  network: NetworkWithCaipId;
  account: Account;
  slippage: number;
  onUpdate: (update: MarkrQuote[]) => void;
  abortSignal: AbortSignal;
}

const GetSwapTransactionResponseSchema = z.object({
  to: z.string(),
  data: z.string(),
  value: z.string(),
});

const GetSpenderAddressResponseSchema = z.object({
  address: z.string(),
});

class MarkrService {
  async getSwapRateStream({
    fromTokenAddress,
    fromTokenDecimals,
    toTokenAddress,
    toTokenDecimals,
    amount,
    network,
    account,
    slippage,
    onUpdate,
    abortSignal,
  }: GetSwapRateStreamParams): Promise<MarkrQuote[] | undefined> {
    try {
      const response = await fetch(`${ORCHESTRATOR_URL}/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: MARKR_EVM_PARTNER_ID,
          chainId: network.chainId,
          from: account.addressC,
          tokenIn: fromTokenAddress,
          tokenInDecimals: fromTokenDecimals,
          tokenOut: toTokenAddress,
          tokenOutDecimals: toTokenDecimals,
          amount,
          slippage,
        }),
        signal: abortSignal,
      });

      if (!response.body) {
        throw new Error('ReadableStream unavailable');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = '';
      let eventBuffer = '';
      let best: MarkrQuote | null = null;
      let allQuotes: MarkrQuote[] = [];

      const onUpdateWrapper = (update: MarkrQuote[]) => {
        if (abortSignal.aborted) {
          throw new Error('aborted');
        }
        onUpdate(update);
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        while (buffer.includes(NEWLINE)) {
          const result = processStreamChunk(
            buffer,
            eventBuffer,
            best,
            allQuotes,
            onUpdateWrapper,
          );
          buffer = result.newBuffer;
          eventBuffer = result.newEvent;
          best = result.newBest;
          allQuotes = result.newAllQuotes;
        }
      }

      return sortQuotesByAmountOut(allQuotes) ?? undefined;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('FetchRequestCanceledException')
      ) {
        throw new Error('Aborted');
      }
      throw error;
    }
  }

  async buildSwapTransaction({
    quote,
    tokenIn,
    tokenOut,
    amountIn,
    minAmountOut,
    appId,
    network,
    from,
  }: {
    quote: MarkrQuote;
    tokenIn: string;
    tokenOut: string;
    amountIn: string;
    minAmountOut: string;
    appId: string;
    network: NetworkWithCaipId;
    from: string;
  }): Promise<MarkrTransaction> {
    const { uuid } = quote;
    const [response, error] = await resolve(
      fetchAndVerify(
        [
          `${ORCHESTRATOR_URL}/swap`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              uuid,
              chainId: network.chainId,
              from,
              tokenIn,
              tokenOut,
              amountIn,
              minAmountOut,
              appId,
            }),
          },
        ],
        GetSwapTransactionResponseSchema,
      ),
    );

    if (!response || error) {
      throw swapError(SwapErrorCode.CannotBuildTx, error);
    }

    return response;
  }

  async getSpenderAddress({ chainId }: { chainId: number }): Promise<string> {
    const [response, error] = await resolve(
      fetchAndVerify(
        [
          `${ORCHESTRATOR_URL}/spender-address?chainId=${chainId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ],
        GetSpenderAddressResponseSchema,
      ),
    );

    if (!response || error) {
      throw swapError(SwapErrorCode.CannotBuildTx, error);
    }

    return response.address;
  }
}

export default new MarkrService();
