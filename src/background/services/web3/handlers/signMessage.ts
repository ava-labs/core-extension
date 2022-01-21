import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DappRequestHandler } from '@src/background/connections/models';
import { MessageType } from '../../messages/models';

class PersonalSignHandler implements DappRequestHandler {
  constructor(private signType: MessageType) {}

  handleUnauthenticated = async (request) => {
    /**
     * For now we are not supporting sign message since we dont have designs, nor
     * do we have a good idea of usage on this feature
     */
    return {
      ...request,
      error: `account not available`,
    };
  };

  handleAuthenticated = async (request) => {
    return {
      ...request,
      error: `requests for ${this.signType} not supported at this time`,
    };
  };
}
export const SignTypedDataRequest: [DAppProviderRequest, DappRequestHandler] = [
  DAppProviderRequest.ETH_SIGN_TYPED_DATA,
  new PersonalSignHandler(MessageType.SIGN_TYPED_DATA),
];

export const SignTypedDataV3Request: [DAppProviderRequest, DappRequestHandler] =
  [
    DAppProviderRequest.ETH_SIGN_TYPED_DATA_V3,
    new PersonalSignHandler(MessageType.SIGN_TYPED_DATA_V3),
  ];

export const SignTypedDataV4Request: [DAppProviderRequest, DappRequestHandler] =
  [
    DAppProviderRequest.ETH_SIGN_TYPED_DATA_V4,
    new PersonalSignHandler(MessageType.SIGN_TYPED_DATA_V4),
  ];

export const PersonalSignRequest: [DAppProviderRequest, DappRequestHandler] = [
  DAppProviderRequest.PERSONAL_SIGN,
  new PersonalSignHandler(MessageType.PERSONAL_SIGN),
];
