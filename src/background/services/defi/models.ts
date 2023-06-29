export type DefiPortfolio = {
  totalUsdValue: number;
  protocols: DefiProtocol[];
};

export type DefiProtocol = {
  id: string;
  name: string;
  siteUrl: string;
  logoUrl: string;
  totalUsdValue: number;

  chainId?: number;
  chainLogoUrl?: string;
};

export interface DefiDataProvider {
  getUserProtocols(address: string): Promise<DefiProtocol[]>;
}
