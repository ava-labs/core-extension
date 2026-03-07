import {
  DAppProviderRequest,
  JsonRpcRequest,
  JsonRpcRequestPayload,
  JsonRpcResponse,
  AgentIdentityDeclaration,
} from '@core/types';
import { Middleware } from './models';
import { AgentIdentityService } from '../../services/agentIdentity/AgentIdentityService';

type AgentIdentityRequest = JsonRpcRequestPayload<
  DAppProviderRequest.AGENT_DECLARE_IDENTITY,
  AgentIdentityDeclaration
>;

const isAgentIdentityRequest = (
  request: JsonRpcRequestPayload<string, unknown>,
): request is AgentIdentityRequest => {
  return request.method === DAppProviderRequest.AGENT_DECLARE_IDENTITY;
};

export function AgentIdentityMiddleware(
  agentIdentityService: AgentIdentityService,
): Middleware<JsonRpcRequest, JsonRpcResponse> {
  return async (context, next) => {
    const requestData = context.request.params.request;

    if (isAgentIdentityRequest(requestData)) {
      try {
        const identity = await agentIdentityService.resolveIdentity(
          requestData.params,
        );
        context.agentIdentity = identity;
      } catch {
        // Non-blocking: if resolution fails, just don't set agent identity
      }
    }

    next();
  };
}
