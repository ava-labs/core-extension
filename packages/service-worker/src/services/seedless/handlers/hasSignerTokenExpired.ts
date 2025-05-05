import { injectable } from 'tsyringe';

import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';

import { SeedlessSessionManager } from '../SeedlessSessionManager';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SEEDLESS_HAS_TOKEN_EXPIRED,
  boolean | undefined
>;

@injectable()
export class HasSignerTokenExpiredHandler implements HandlerType {
  method = ExtensionRequest.SEEDLESS_HAS_TOKEN_EXPIRED as const;

  constructor(private sessionMgr: SeedlessSessionManager) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    return {
      ...request,
      result: this.sessionMgr.hasTokenExpired,
    };
  };
}
