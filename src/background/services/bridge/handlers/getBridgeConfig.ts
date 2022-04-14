import {
  BridgeConfig,
  Environment,
  fetchConfig,
  setBridgeEnvironment,
} from '@avalabs/bridge-sdk';
import { MAINNET_NETWORK, network$ } from '@avalabs/wallet-react-components';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { bridgeConfig$ } from '../bridgeConfig';

export async function getBridgeConfig() {
  const network = await firstValueFrom(network$);
  setBridgeEnvironment(
    network?.chainId === MAINNET_NETWORK.chainId
      ? Environment.PROD
      : Environment.DEV
  );
  const config = await fetchConfig();

  bridgeConfig$.next(config);
  return config;
}

async function getBridgeConfigHandler(request: ExtensionConnectionMessage) {
  const config = await getBridgeConfig();
  return { ...request, result: config };
}

export const GetBridgeConfigRequest: [
  ExtensionRequest,
  ConnectionRequestHandler<BridgeConfig>
] = [ExtensionRequest.BRIDGE_GET_CONFIG, getBridgeConfigHandler];
