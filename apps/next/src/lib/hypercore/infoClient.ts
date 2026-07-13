import type { z } from 'zod';
import {
  clearinghouseStateSchema,
  hypercoreLedgerUpdatesSchema,
  spotClearinghouseStateSchema,
  spotMetaResponseSchema,
  userAbstractionSchema,
  userFillsSchema,
} from './schemas';

export type HypercoreInfoRequest =
  | { type: 'spotMeta' }
  | { type: 'spotClearinghouseState'; user: string; dex?: string }
  | { type: 'clearinghouseState'; user: string; dex?: string }
  | { type: 'userAbstraction'; user: string }
  | { type: 'userFills'; user: string }
  | {
      type: 'userNonFundingLedgerUpdates';
      user: string;
      startTime: number;
    };

export const getHypercoreInfoUrl = () =>
  `${process.env.PROXY_URL}/proxy/nownodes/hype/info`;

export const getHypercoreActivityInfoUrl = () =>
  'https://api.hyperliquid.xyz/info';

type PostInfoOptions = {
  signal?: AbortSignal;
  /** Defaults to the NowNodes proxy URL. */
  url?: string;
};

export const postInfo = async <T>(
  body: HypercoreInfoRequest,
  schema: z.ZodType<T>,
  options?: PostInfoOptions,
) => {
  const response = await fetch(options?.url ?? getHypercoreInfoUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: options?.signal,
  });

  if (!response.ok) {
    throw new Error(
      `Hyperliquid /info failed: ${response.status} ${response.statusText}`,
    );
  }

  const json: unknown = await response.json();
  return schema.parse(json);
};

const lowercaseUser = (user: string) => user.toLowerCase();

export const getSpotMeta = (options?: PostInfoOptions) =>
  postInfo({ type: 'spotMeta' }, spotMetaResponseSchema, options);

export const getSpotClearinghouseState = (
  user: string,
  options?: PostInfoOptions,
) =>
  postInfo(
    {
      type: 'spotClearinghouseState',
      user: lowercaseUser(user),
      dex: '',
    },
    spotClearinghouseStateSchema,
    options,
  );

export const getClearinghouseState = (
  user: string,
  options?: PostInfoOptions,
) =>
  postInfo(
    {
      type: 'clearinghouseState',
      user: lowercaseUser(user),
      dex: '',
    },
    clearinghouseStateSchema,
    options,
  );

export const getUserAbstraction = (user: string, options?: PostInfoOptions) =>
  postInfo(
    { type: 'userAbstraction', user: lowercaseUser(user) },
    userAbstractionSchema,
    options,
  );

export const getUserFills = (user: string, options?: PostInfoOptions) =>
  postInfo({ type: 'userFills', user: lowercaseUser(user) }, userFillsSchema, {
    ...options,
    url: options?.url ?? getHypercoreActivityInfoUrl(),
  });

export const getUserNonFundingLedgerUpdates = (
  user: string,
  startTime: number,
  options?: PostInfoOptions,
) =>
  postInfo(
    {
      type: 'userNonFundingLedgerUpdates',
      user: lowercaseUser(user),
      startTime,
    },
    hypercoreLedgerUpdatesSchema,
    {
      ...options,
      url: options?.url ?? getHypercoreActivityInfoUrl(),
    },
  );
