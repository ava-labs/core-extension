import { isSyncDomain } from '@core/common';
import { JsonRpcRequest } from '@core/types';

import { Context } from '../models';

export const getKnownOrWhitelistedContext = (
  context: Context<JsonRpcRequest<string, unknown>, unknown>,
) => {
  const { recurringSwaps, agentIdentity } =
    context.request.params.request.context ?? {};

  return {
    recurringSwaps: isSyncDomain(context.domainMetadata?.domain ?? '')
      ? (recurringSwaps ?? undefined)
      : undefined,
    agentIdentity: agentIdentity ?? undefined,
  };
};
