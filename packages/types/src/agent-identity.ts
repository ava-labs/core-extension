export interface AgentIdentity {
  agentId: string;
  agentRegistry: string; // CAIP-10 format, e.g. "eip155:43114:0x8004..."
  owner: string | null; // NFT owner address, null if unresolvable
  reputationScore: number | null; // 0-100, null if unresolvable
  metadataUri: string | null;
  trustLevel: 'high' | 'medium' | 'low' | 'unknown';
}

export interface AgentIdentityDeclaration {
  agentId: string;
  agentRegistry: string; // CAIP-10
}
