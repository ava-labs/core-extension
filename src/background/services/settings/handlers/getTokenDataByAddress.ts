import { Assets } from '@avalabs/avalanche-wallet-sdk';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';

export async function settingsGetTokenDataByAddress(
  request: ExtensionConnectionMessage
) {
  const [tokenAddress] = request.params || [];
  try {
    const tokenData = await Assets.getContractDataErc20(tokenAddress);
    return {
      ...request,
      result: tokenData,
    };
  } catch {
    return {
      ...request,
      result: false,
    };
  }
}

export const SettingsGetTokenDataRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.SETTINGS_GET_TOKEN_DATA, settingsGetTokenDataByAddress];
