import { injectable } from 'tsyringe';

import {
  SecretType,
  ExtensionRequest,
  ExtensionRequestHandler,
  IsKnownSecretResult,
} from '@core/types';

import { SecretsService } from '../../secrets/SecretsService';

type Params =
  | [SecretType.LedgerLive, publicKey: string]
  | [SecretType.Ledger, extendedPublicKey: string];

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.WALLET_CHECK_IF_EXISTS,
  IsKnownSecretResult,
  Params
>;

@injectable()
export class CheckIfWalletExists implements HandlerType {
  method = ExtensionRequest.WALLET_CHECK_IF_EXISTS as const;

  constructor(private secretsService: SecretsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [secretType, secret] = request.params;

    try {
      return {
        ...request,
        result: await this.secretsService.isKnownSecret(secretType, secret),
      };
    } catch (error) {
      return {
        ...request,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };
}
