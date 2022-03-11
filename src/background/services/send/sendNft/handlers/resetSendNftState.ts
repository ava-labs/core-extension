import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { SEND_NFT_FORM_DEFAULT } from '@avalabs/wallet-react-components';

async function resetSendNftState(request: ExtensionConnectionMessage) {
  const [contractAddress, tokenId] = request.params || [];

  if (!contractAddress) {
    return {
      ...request,
      error: 'no contractAddress in params',
    };
  }

  if (!tokenId) {
    return {
      ...request,
      error: 'no tokenId in params',
    };
  }

  return {
    ...request,
    result: {
      ...SEND_NFT_FORM_DEFAULT,
      contractAddress,
      tokenId,
    },
  };
}

export const ResetSendNftStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.SEND_NFT_RESET, resetSendNftState];
