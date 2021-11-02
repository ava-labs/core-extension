import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
} from '@src/background/connections/models';

export async function setDomainMetadata(data: ExtensionConnectionMessage) {
  return { ...data, result: data.params };
}

export const SetDomainMetadataRequest: [
  DAppProviderRequest,
  ConnectionRequestHandler
] = [DAppProviderRequest.DOMAIN_METADATA_METHOD, setDomainMetadata];
