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
  chainName?: string;

  groups: DefiItemGroup[];
};

export type DefiToken = {
  name: string;
  symbol: string;
  decimals: number;
  logoUrl: string;
  price: number;
  amount: number;
  usdValue: number;
};

interface BaseDefiItem {
  type: DefiItemType;
  name: string;
  netUsdValue: number;
}

export enum DefiItemType {
  Common = 'common',
  Locked = 'locked',
  Lending = 'lending',
  Vesting = 'vesting',
  Reward = 'reward',
  InsuranceBuyer = 'insurance_buyer',
  Perpetual = 'perpetual',
}

export interface DefiCommonItem extends BaseDefiItem {
  type: DefiItemType.Common;
  supplyTokens?: DefiToken[];
  rewardTokens?: DefiToken[];
}

export interface DefiLendingItem extends BaseDefiItem {
  type: DefiItemType.Lending;
  healthRate?: number;
  supplyTokens: DefiToken[];
  borrowTokens: DefiToken[];
  rewardTokens: DefiToken[];
}

export interface DefiVestingItem extends BaseDefiItem {
  type: DefiItemType.Vesting;
  token: DefiToken & {
    claimableAmount?: number;
  };
  dailyUnlockAmount?: number;
  endAt?: number;
}

export interface DefiRewardItem extends BaseDefiItem {
  type: DefiItemType.Reward;
  tokens: DefiToken[];
}

interface DefiInsuranceItem extends BaseDefiItem {
  expiredAt: number;
  description: string;
}
export interface DefiInsuranceBuyerItem extends DefiInsuranceItem {
  type: DefiItemType.InsuranceBuyer;
}

export interface DefiPerpetualItem extends BaseDefiItem {
  type: DefiItemType.Perpetual;
  positionToken: DefiToken;
  marginToken: DefiToken;
  profitUsdValue: number;
  netUsdValue: number;
}

// Represents a singular DeFi investment
export type DefiItem =
  | DefiCommonItem
  | DefiLendingItem
  | DefiVestingItem
  | DefiRewardItem
  | DefiPerpetualItem
  | DefiInsuranceBuyerItem;

// Groups DefiItems under one name (e.g. 'Lending', 'Liquidity Pool')
export type DefiItemGroup = {
  name: string;
  items: DefiItem[];
  totalUsdValue: number;
};

export interface DefiDataProvider {
  getUserProtocols(address: string): Promise<DefiProtocol[]>;
}

export enum DefiServiceEvents {
  PortfolioUpdated = 'DefiService::PortfolioUpdated',
}

export type DefiPortfolioUpdatedEvent = {
  address: string;
  portfolio: DefiPortfolio;
};
