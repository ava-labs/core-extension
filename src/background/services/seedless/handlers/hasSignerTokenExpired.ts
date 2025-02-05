import { injectable } from 'tsyringe';

import type { ExtensionRequestHandler } from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';

import type { SeedlessSessionManager } from '../SeedlessSessionManager';

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
