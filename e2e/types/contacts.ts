/**
 * Contact data structure for creating contacts
 */
export interface ContactData {
  name: string;
  avalancheCChain?: string;
  avalancheXP?: string;
  bitcoin?: string;
  solana?: string;
}

/**
 * Contact data structure for updating contacts
 */
export interface ContactUpdateData {
  name?: string;
  avalancheCChain?: string;
  avalancheXP?: string;
  bitcoin?: string;
  solana?: string;
}
