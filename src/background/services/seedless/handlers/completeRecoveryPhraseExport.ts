import { injectable } from 'tsyringe';
import {
  userExportDecrypt,
  userExportKeygen,
} from '@cubist-labs/cubesigner-sdk';

import { ExtensionRequestHandler } from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';

import { SecretsService } from '../../secrets/SecretsService';
import { SecretType } from '../../secrets/models';
import { SeedlessWallet } from '../SeedlessWallet';
import { SeedlessTokenStorage } from '../SeedlessTokenStorage';
import { SeedlessMfaService } from '../SeedlessMfaService';
import { NetworkService } from '../../network/NetworkService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SEEDLESS_COMPLETE_RECOVERY_PHRASE_EXPORT,
  string
>;

@injectable()
export class CompleteRecoveryPhraseExportHandler implements HandlerType {
  method = ExtensionRequest.SEEDLESS_COMPLETE_RECOVERY_PHRASE_EXPORT as const;

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
        error: 'Action only available for seedless wallets',
      };
    }

    const wallet = new SeedlessWallet({
      networkService: this.networkService,
      sessionStorage: new SeedlessTokenStorage(this.secretsService),
      addressPublicKey: secrets.pubKeys[0],
      mfaService: this.seedlessMfaService,
    });

    const keyPair = await userExportKeygen();
    const exportResponse = await wallet.completeMnemonicExport(
      keyPair.publicKey,
      request.tabId
    );

    const exportDecrypted = await userExportDecrypt(
      keyPair.privateKey,
      exportResponse
    );

    // This check is needed due to typing errors in CubeSigner SDK
    // (the `mnemonic` field is not present there).
    // TODO: remove when typings are fixed.
    const hasMnemonic = 'mnemonic' in exportDecrypted;

    if (!hasMnemonic || typeof exportDecrypted.mnemonic !== 'string') {
      return {
        ...request,
        error: 'Unexpected error occured while decrypting the recovery phrase',
      };
    }

    return {
      ...request,
      result: exportDecrypted.mnemonic,
    };
  };
}
