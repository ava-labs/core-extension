import { resolve } from '@avalabs/core-utils-sdk';
import { ExtensionRequest } from '../../../connections/extensionConnection/models';
import { ExtensionRequestHandler } from '../../../connections/models';
import { injectable } from 'tsyringe';
import { TokenManagerService } from '../../tokens/TokenManagerService';
import { SettingsService } from '../SettingsService';
import { NetworkService } from '../../network/NetworkService';

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
    private tokenManagerService: TokenManagerService,
    private networkService: NetworkService,
  ) {}

  handle: HandlerType['handle'] = async ({ request, scope }) => {
    const network = await this.networkService.getNetwork(scope);

    if (!network) {
      return {
        ...request,
        error: 'Target network not found',
      };
    }

    const [tokenAddress] = request.params;
    const [tokenData, err] = await resolve(
      this.tokenManagerService.getTokenData(tokenAddress, network),
    );

    if (!tokenData || err) {
      return {
        ...request,
        error: `ERC20 contract ${tokenAddress} does not exist.`,
      };
    }

    const [, saveError] = await resolve(
      this.settingsService.addCustomToken(tokenData),
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
