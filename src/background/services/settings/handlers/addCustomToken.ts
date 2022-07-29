import { resolve } from '@avalabs/utils-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { TokenManagerService } from '../../tokens/TokenManagerService';
import { SettingsService } from '../SettingsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SETTINGS_ADD_CUSTOM_TOKEN,
  boolean,
  [tokenAddress: string]
>;

@injectable()
export class AddCustomTokenHandler implements HandlerType {
  method = ExtensionRequest.SETTINGS_ADD_CUSTOM_TOKEN as const;

  constructor(
    private settingsService: SettingsService,
    private tokenManagerService: TokenManagerService
  ) {}

  handle: HandlerType['handle'] = async (request) => {
    const [tokenAddress] = request.params;
    const [tokenData, err] = await resolve(
      this.tokenManagerService.getTokenData(tokenAddress)
    );

    if (!tokenData || err) {
      return {
        ...request,
        error: `ERC20 contract ${tokenAddress} does not exist.`,
      };
    }

    const [, saveError] = await resolve(
      this.settingsService.addCustomToken(tokenData)
    );

    if (saveError) {
      return {
        ...request,
        result: false,
        error: (saveError as any).toString(),
      };
    }

    return {
      ...request,
      result: true,
    };
  };
}
