import { AgentIdentityService } from './AgentIdentityService';
import { Contract } from 'ethers';

// Mock ethers
jest.mock('ethers', () => ({
  JsonRpcProvider: jest.fn().mockImplementation(() => ({})),
  Contract: jest.fn().mockImplementation(() => ({
    getFunction: jest.fn(),
  })),
}));

describe('AgentIdentityService', () => {
  let service: AgentIdentityService;

  const setupMocks = (overrides?: {
    tokenURI?: jest.Mock;
    ownerOf?: jest.Mock;
    getReputation?: jest.Mock;
  }) => {
    const mockTokenURI =
      overrides?.tokenURI ??
      jest.fn().mockResolvedValue('ipfs://metadata');
    const mockOwnerOf =
      overrides?.ownerOf ??
      jest.fn().mockResolvedValue('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    const mockGetReputation =
      overrides?.getReputation ??
      jest.fn().mockResolvedValue(BigInt(85));

    (service as any).identityRegistry.getFunction = jest
      .fn()
      .mockImplementation((name: string) => {
        if (name === 'tokenURI') return mockTokenURI;
        if (name === 'ownerOf') return mockOwnerOf;
        return jest.fn().mockRejectedValue(new Error('Unknown'));
      });

    (service as any).reputationRegistry.getFunction = jest
      .fn()
      .mockImplementation((name: string) => {
        if (name === 'getReputation') return mockGetReputation;
        return jest.fn().mockRejectedValue(new Error('Unknown'));
      });

    return { mockTokenURI, mockOwnerOf, mockGetReputation };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AgentIdentityService();
  });

  describe('resolveIdentity', () => {
    const validDeclaration = {
      agentId: '1599',
      agentRegistry:
        'eip155:43114:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
    };

    it('returns identity with high trust for score >= 75', async () => {
      setupMocks();

      const result = await service.resolveIdentity(validDeclaration);

      expect(result).toEqual({
        agentId: '1599',
        agentRegistry:
          'eip155:43114:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
        owner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        reputationScore: 85,
        metadataUri: 'ipfs://metadata',
        trustLevel: 'high',
      });
    });

    it('returns identity with medium trust for score >= 40 and < 75', async () => {
      setupMocks({
        getReputation: jest.fn().mockResolvedValue(BigInt(50)),
      });

      const result = await service.resolveIdentity(validDeclaration);

      expect(result.trustLevel).toBe('medium');
      expect(result.reputationScore).toBe(50);
    });

    it('returns identity with low trust for score < 40', async () => {
      setupMocks({
        getReputation: jest.fn().mockResolvedValue(BigInt(20)),
      });

      const result = await service.resolveIdentity(validDeclaration);

      expect(result.trustLevel).toBe('low');
      expect(result.reputationScore).toBe(20);
    });

    it('returns unknown trust level when reputation call fails', async () => {
      setupMocks({
        getReputation: jest
          .fn()
          .mockRejectedValue(new Error('Network error')),
      });

      const result = await service.resolveIdentity(validDeclaration);

      expect(result.trustLevel).toBe('unknown');
      expect(result.reputationScore).toBeNull();
      expect(result.metadataUri).toBe('ipfs://metadata');
      expect(result.owner).toBe(
        '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      );
    });

    it('returns null metadataUri when tokenURI call fails', async () => {
      setupMocks({
        tokenURI: jest
          .fn()
          .mockRejectedValue(new Error('Token not found')),
        getReputation: jest.fn().mockResolvedValue(BigInt(75)),
      });

      const result = await service.resolveIdentity(validDeclaration);

      expect(result.metadataUri).toBeNull();
      expect(result.reputationScore).toBe(75);
      expect(result.trustLevel).toBe('high');
    });

    it('returns null owner when ownerOf call fails', async () => {
      setupMocks({
        ownerOf: jest
          .fn()
          .mockRejectedValue(new Error('Not found')),
      });

      const result = await service.resolveIdentity(validDeclaration);

      expect(result.owner).toBeNull();
      expect(result.metadataUri).toBe('ipfs://metadata');
      expect(result.reputationScore).toBe(85);
    });

    it('returns unknown identity for invalid CAIP-10 format', async () => {
      const invalidDeclaration = {
        agentId: '1599',
        agentRegistry: 'invalid-format',
      };

      const result = await service.resolveIdentity(invalidDeclaration);

      expect(result).toEqual({
        agentId: '1599',
        agentRegistry: 'invalid-format',
        owner: null,
        reputationScore: null,
        metadataUri: null,
        trustLevel: 'unknown',
      });
    });

    it('caches identity and returns cached result on subsequent calls', async () => {
      const { mockTokenURI } = setupMocks();

      const result1 = await service.resolveIdentity(validDeclaration);
      const result2 = await service.resolveIdentity(validDeclaration);

      expect(mockTokenURI).toHaveBeenCalledTimes(1);
      expect(result1).toEqual(result2);
    });

    it('clamps reputation score to 0-100 range', async () => {
      setupMocks({
        getReputation: jest.fn().mockResolvedValue(BigInt(150)),
      });

      const result = await service.resolveIdentity(validDeclaration);

      expect(result.reputationScore).toBe(100);
    });
  });
});
