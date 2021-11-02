import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
} from '@src/background/connections/models';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { firstValueFrom, map, merge } from 'rxjs';
import { addMessage, pendingMessages } from '../../messages/messages';
import { MessageType } from '../../messages/models';

async function signMessage(
  data: ExtensionConnectionMessage,
  signType: MessageType
) {
  /**
   * For now we are not supporting sign message since we dont have designs, nor
   * do we have a good idea of usage on this feature
   */
  return {
    data,
    error: `requests for ${signType} not supported at this time`,
  };

  addMessage.next({ data, signType } as any);
  const window = await openExtensionNewWindow(
    `sign?id=${data.id}`,
    '',
    data.meta?.coords
  );
  return await firstValueFrom(
    merge(
      pendingMessages.pipe(map((result) => ({ result }))),
      window.removed.pipe(map(() => ({ error: 'Window closed before signed' })))
    ).pipe(
      map((value) => ({
        ...data,
        ...value,
      }))
    )
  );
}

export const SignTypedDataRequest: [
  DAppProviderRequest,
  ConnectionRequestHandler
] = [
  DAppProviderRequest.ETH_SIGN_TYPED_DATA,
  async function eth_signTypedData(
    data: ExtensionConnectionMessage
  ): Promise<any> {
    return await signMessage(data, MessageType.SIGN_TYPED_DATA);
  },
];

export const SignTypedDataV3Request: [
  DAppProviderRequest,
  ConnectionRequestHandler
] = [
  DAppProviderRequest.ETH_SIGN_TYPED_DATA_V3,
  async function eth_signTypedData_v3(
    data: ExtensionConnectionMessage
  ): Promise<any> {
    return await signMessage(data, MessageType.SIGN_TYPED_DATA_V3);
  },
];

export const SignTypedDataV4Request: [
  DAppProviderRequest,
  ConnectionRequestHandler
] = [
  DAppProviderRequest.ETH_SIGN_TYPED_DATA_V4,
  async function eth_signTypedData_v4(
    data: ExtensionConnectionMessage
  ): Promise<any> {
    return await signMessage(data, MessageType.SIGN_TYPED_DATA_V4);
  },
];

export const PersonalSignRequest: [
  DAppProviderRequest,
  ConnectionRequestHandler
] = [
  DAppProviderRequest.PERSONAL_SIGN,
  async function personal_sign(data: ExtensionConnectionMessage): Promise<any> {
    return await signMessage(data, MessageType.PERSONAL_SIGN);
  },
];
