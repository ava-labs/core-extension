import { DomainMetadata } from '@src/background/models';
import { Runtime } from 'webextension-polyfill-ts';
import {
  DAppProviderRequest,
  JsonRpcRequest,
  JsonRpcResponse,
} from '../dAppConnection/models';
import { Middleware } from './models';

interface DomainMetadataRequest extends JsonRpcRequest<DomainMetadata> {
  method: DAppProviderRequest.DOMAIN_METADATA_METHOD;
  params: DomainMetadata;
}

const isMetadataRequest = (
  request: JsonRpcRequest<unknown>
): request is DomainMetadataRequest => {
  return request.method === DAppProviderRequest.DOMAIN_METADATA_METHOD;
};

export function SiteMetadataMiddleware(
  connection: Runtime.Port
): Middleware<JsonRpcRequest, JsonRpcResponse> {
  /**
   * Domain is per connection so this needs to remain an closure to the connection
   */
  const domainMetadata: DomainMetadata = {
    domain: connection.sender?.url
      ? new URL(connection.sender?.url || '').hostname
      : 'unknown',
    tabId: connection.sender?.tab?.id,
  };

  return (context, next, error) => {
    context.domainMetadata = {
      ...domainMetadata,
    };

    const requestData = context.request;
    if (!isMetadataRequest(requestData)) {
      next();
      return;
    }

    // if the domain is not the same abort execution
    // domain should not be able to change for the connection
    // new domain -> new connection
    if (requestData.params.domain !== domainMetadata.domain) {
      error(new Error('Connection and reported domain does not match'));
    }

    domainMetadata.icon = requestData.params.icon;
    domainMetadata.name = requestData.params.name;
    context.domainMetadata = {
      ...domainMetadata,
    };
    next();
  };
}
