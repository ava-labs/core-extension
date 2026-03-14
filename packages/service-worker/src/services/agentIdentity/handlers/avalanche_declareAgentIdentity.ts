import { injectable } from 'tsyringe';
import {
  DAppRequestHandler,
  DAppProviderRequest,
  AgentIdentityDeclaration,
} from '@core/types';
import { AgentIdentityService } from '../AgentIdentityService';

@injectable()
export class AvalancheDeclareAgentIdentityHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.AGENT_DECLARE_IDENTITY];

  constructor(private agentIdentityService: AgentIdentityService) {
    super();
  }

  handleUnauthenticated = async ({ request }) => {
    const declaration = request.params as AgentIdentityDeclaration;
    const identity =
      await this.agentIdentityService.resolveIdentity(declaration);
    return { result: identity };
  };

  handleAuthenticated = async (rpcCall) => {
    return this.handleUnauthenticated(rpcCall);
  };
}
