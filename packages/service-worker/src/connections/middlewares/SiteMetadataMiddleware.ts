import { Runtime } from 'webextension-polyfill';
import {
  DAppProviderRequest,
	DomainMetadata,
  JsonRpcRequest,
  JsonRpcRequestPayload,
  JsonRpcResponse,
} from '@core/types';
import { Middleware } from './models';

type DomainMetadataRequest = JsonRpcRequestPayload<
  DAppProviderRequest.DOMAIN_METADATA_METHOD,
  DomainMetadata
>;

const isMetadataRequest = (
  request: JsonRpcRequestPayload<string, unknown>,
): request is DomainMetadataRequest => {
  return request.method === DAppProviderRequest.DOMAIN_METADATA_METHOD;
};

export function SiteMetadataMiddleware(
  connection: Runtime.Port,
): Middleware<JsonRpcRequest, JsonRpcResponse> {
  /**
   * Domain is per connection so this needs to remain an closure to the connection
   */
  const domainMetadata: DomainMetadata = {
    domain: connection.sender?.url
      ? new URL(connection.sender?.url || '').hostname
      : 'unknown',
    tabId: connection.sender?.tab?.id,
    url: connection.sender?.url,
  };

  return (context, next, error) => {
    context.domainMetadata = {
      ...domainMetadata,
    };

    const requestData = context.request.params.request;
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
