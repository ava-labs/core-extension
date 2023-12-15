import { injectable } from 'tsyringe';

import { ExtensionRequestHandler } from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';

import { SecretsService } from '../../secrets/SecretsService';
import { SecretType } from '../../secrets/models';
import { SeedlessWallet } from '../SeedlessWallet';
import { SeedlessTokenStorage } from '../SeedlessTokenStorage';
import { NetworkService } from '../../network/NetworkService';
import { SeedlessMfaService } from '../SeedlessMfaService';
import { UserExportInitResponse } from '@cubist-labs/cubesigner-sdk';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SEEDLESS_GET_RECOVERY_PHRASE_EXPORT_STATE,
  UserExportInitResponse | undefined
>;

@injectable()
export class GetRecoveryPhraseExportStateHandler implements HandlerType {
  method = ExtensionRequest.SEEDLESS_GET_RECOVERY_PHRASE_EXPORT_STATE as const;

  constructor(
    private secretsService: SecretsService,
    private networkService: NetworkService,
    private seedlessMfaService: SeedlessMfaService
  ) {}

  handle: HandlerType['handle'] = async (request) => {
    const secrets = await this.secretsService.getPrimaryAccountSecrets();

    if (secrets?.type !== SecretType.Seedless) {
      return {
        ...request,
        result: undefined,
      };
    }

    const wallet = new SeedlessWallet({
      networkService: this.networkService,
      sessionStorage: new SeedlessTokenStorage(this.secretsService),
      addressPublicKey: secrets.pubKeys[0],
      mfaService: this.seedlessMfaService,
    });

    try {
      return {
        ...request,
        result: await wallet.getMnemonicExportState(),
      };
    } catch (err: any) {
      return {
        ...request,
        error: err instanceof Error ? err.message : err.toString(),
      };
    }
  };
}
