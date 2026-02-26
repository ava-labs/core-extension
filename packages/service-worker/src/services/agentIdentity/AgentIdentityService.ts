import { singleton } from 'tsyringe';
import { JsonRpcProvider, Contract } from 'ethers';
import { AgentIdentity, AgentIdentityDeclaration } from '@core/types';

const AVALANCHE_C_CHAIN_RPC = 'https://api.avax.network/ext/bc/C/rpc';
const IDENTITY_REGISTRY_ADDRESS = '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432';
const REPUTATION_REGISTRY_ADDRESS =
  '0x8004BAa17C55a88189AE136b182e5fdA19dE9b63';

const IDENTITY_REGISTRY_ABI = [
  'function tokenURI(uint256 agentId) view returns (string)',
  'function ownerOf(uint256 agentId) view returns (address)',
];
const REPUTATION_REGISTRY_ABI = [
  'function getReputation(uint256 agentId) view returns (uint256)',
];

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  identity: AgentIdentity;
  timestamp: number;
}

@singleton()
export class AgentIdentityService {
  private cache: Map<string, CacheEntry> = new Map();
  private provider: JsonRpcProvider;
  private identityRegistry: Contract;
  private reputationRegistry: Contract;

  constructor() {
    this.provider = new JsonRpcProvider(AVALANCHE_C_CHAIN_RPC);
    this.identityRegistry = new Contract(
      IDENTITY_REGISTRY_ADDRESS,
      IDENTITY_REGISTRY_ABI,
      this.provider,
    );
    this.reputationRegistry = new Contract(
      REPUTATION_REGISTRY_ADDRESS,
      REPUTATION_REGISTRY_ABI,
      this.provider,
    );
  }

  private getCacheKey(declaration: AgentIdentityDeclaration): string {
    return `${declaration.agentRegistry}:${declaration.agentId}`;
  }

  private getCachedIdentity(
    declaration: AgentIdentityDeclaration,
  ): AgentIdentity | null {
    const key = this.getCacheKey(declaration);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > CACHE_TTL_MS) {
      this.cache.delete(key);
      return null;
    }

    return entry.identity;
  }

  private cacheIdentity(
    declaration: AgentIdentityDeclaration,
    identity: AgentIdentity,
  ): void {
    const key = this.getCacheKey(declaration);
    this.cache.set(key, {
      identity,
      timestamp: Date.now(),
    });
  }

  private parseContractAddress(agentRegistry: string): string | null {
    // CAIP-10 format: eip155:43114:0x8004...
    const parts = agentRegistry.split(':');
    if (parts.length !== 3) {
      return null;
    }
    return parts[2] ?? null;
  }

  private deriveTrustLevel(score: number | null): AgentIdentity['trustLevel'] {
    if (score === null) {
      return 'unknown';
    }
    if (score >= 75) {
      return 'high';
    }
    if (score >= 40) {
      return 'medium';
    }
    return 'low';
  }

  async resolveIdentity(
    declaration: AgentIdentityDeclaration,
  ): Promise<AgentIdentity> {
    // Check cache first
    const cached = this.getCachedIdentity(declaration);
    if (cached) {
      return cached;
    }

    const contractAddress = this.parseContractAddress(
      declaration.agentRegistry,
    );
    if (!contractAddress) {
      const identity: AgentIdentity = {
        agentId: declaration.agentId,
        agentRegistry: declaration.agentRegistry,
        owner: null,
        reputationScore: null,
        metadataUri: null,
        trustLevel: 'unknown',
      };
      this.cacheIdentity(declaration, identity);
      return identity;
    }

    const agentIdBigInt = BigInt(declaration.agentId);

    // Use Promise.allSettled so failures are non-blocking
    const [metadataResult, ownerResult, reputationResult] =
      await Promise.allSettled([
        this.identityRegistry.getFunction('tokenURI')(
          agentIdBigInt,
        ) as Promise<string>,
        this.identityRegistry.getFunction('ownerOf')(
          agentIdBigInt,
        ) as Promise<string>,
        this.reputationRegistry.getFunction('getReputation')(
          agentIdBigInt,
        ) as Promise<bigint>,
      ]);

    const metadataUri =
      metadataResult.status === 'fulfilled' ? metadataResult.value : null;
    const owner =
      ownerResult.status === 'fulfilled' ? ownerResult.value : null;

    let reputationScore: number | null = null;
    if (reputationResult.status === 'fulfilled') {
      const score = Number(reputationResult.value);
      // Clamp to 0-100 range
      reputationScore = Math.max(0, Math.min(100, score));
    }

    const identity: AgentIdentity = {
      agentId: declaration.agentId,
      agentRegistry: declaration.agentRegistry,
      owner,
      reputationScore,
      metadataUri,
      trustLevel: this.deriveTrustLevel(reputationScore),
    };

    this.cacheIdentity(declaration, identity);
    return identity;
  }
}
