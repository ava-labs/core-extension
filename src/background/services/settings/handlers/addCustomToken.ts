import { Assets } from '@avalabs/avalanche-wallet-sdk';
import { network$, walletState$ } from '@avalabs/wallet-react-components';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { SettingsState } from '../models';
import { settings$ } from '../settings';
import { saveSettingsToStorage } from '../storage';

export async function settingsAddCustomToken(
  request: ExtensionConnectionMessage
): Promise<ExtensionConnectionMessageResponse> {
  const [tokenAddress] = request.params || [];

  const settings = await firstValueFrom(settings$);
  const network = await firstValueFrom(network$);

  const walletState = await firstValueFrom(walletState$);
  if (!walletState?.erc20Tokens) {
    return {
      ...request,
      result: false,
      error: 'No ERC20 tokens found in wallet.',
    };
  }
  const tokenAlreadyExists = walletState.erc20Tokens.reduce(
    (exists, existingToken) => exists || existingToken.address === tokenAddress,
    false
  );
  if (tokenAlreadyExists) {
    return {
      ...request,
      result: false,
      error: 'Token already exists in the wallet.',
    };
  }

  const chain = network?.chainId;
  if (!chain) {
    return {
      ...request,
      result: false,
      error: 'Unable to detect current network selection.',
    };
  }

  try {
    const tokenData = await Assets.getContractDataErc20(tokenAddress);
    if (!tokenData) {
      return {
        ...request,
        result: false,
        error: `ERC20 contract ${tokenAddress} does not exist.`,
      };
    }

    const customTokens = settings.customTokens || {};
    const newSettings: SettingsState = {
      ...settings,
      customTokens: {
        ...customTokens,
        [chain]: {
          ...customTokens[chain],
          [tokenAddress]: tokenData,
        },
      },
    };

    await saveSettingsToStorage(newSettings);

    settings$.next(newSettings);

    return {
      ...request,
      result: true,
    };
  } catch (error: any) {
    return {
      ...request,
      result: false,
      error: error.message,
    };
  }
}

export const SettingsAddCustomTokenRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.SETTINGS_ADD_CUSTOM_TOKEN, settingsAddCustomToken];
