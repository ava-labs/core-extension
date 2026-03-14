import { DAppProviderRequest } from '@core/types';
import { AvalancheDeclareAgentIdentityHandler } from './avalanche_declareAgentIdentity';
import { buildRpcCall } from '@shared/tests/test-utils';

describe('avalanche_declareAgentIdentity handler', () => {
  const mockIdentity = {
    agentId: '1599',
    agentRegistry: 'eip155:43114:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
    reputationScore: 85,
    metadataUri: 'ipfs://metadata',
    trustLevel: 'high' as const,
  };

  const mockAgentIdentityService = {
    resolveIdentity: jest.fn().mockResolvedValue(mockIdentity),
  };

  const request = {
    id: '123',
    method: DAppProviderRequest.AGENT_DECLARE_IDENTITY,
    params: {
      agentId: '1599',
      agentRegistry: 'eip155:43114:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
    },
  } as const;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('has correct methods array', () => {
    const handler = new AvalancheDeclareAgentIdentityHandler(
      mockAgentIdentityService as any,
    );

    expect(handler.methods).toEqual([
      DAppProviderRequest.AGENT_DECLARE_IDENTITY,
    ]);
  });

  describe('handleAuthenticated', () => {
    it('resolves and returns agent identity', async () => {
      const handler = new AvalancheDeclareAgentIdentityHandler(
        mockAgentIdentityService as any,
      );

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(mockAgentIdentityService.resolveIdentity).toHaveBeenCalledWith({
        agentId: '1599',
        agentRegistry:
          'eip155:43114:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
      });
      expect(result).toEqual({ result: mockIdentity });
    });
  });

  describe('handleUnauthenticated', () => {
    it('resolves and returns agent identity (same as authenticated)', async () => {
      const handler = new AvalancheDeclareAgentIdentityHandler(
        mockAgentIdentityService as any,
      );

      const result = await handler.handleUnauthenticated(buildRpcCall(request));

      expect(mockAgentIdentityService.resolveIdentity).toHaveBeenCalledWith({
        agentId: '1599',
        agentRegistry:
          'eip155:43114:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
      });
      expect(result).toEqual({ result: mockIdentity });
    });
  });
});
