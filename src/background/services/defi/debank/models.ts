// The API reference:
// https://docs.open.debank.com/en/reference/api-models/portfolioitemobject

export type DebankChain = {
  id: string;
  community_id: number;
  name: string;
  native_token_id: string;
  logo_url: string;
  wrapped_token_id: string;
  is_support_pre_exec: boolean;
};

export type DebankTokenObject = {
  id: string;
  chain: string;
  name: string;
  symbol: string;
  display_symbol: string | null;
  optimized_symbol: string;
  decimals: number;
  logo_url: string;
  protocol_id: string;
  price: number;
  is_verified: boolean;
  is_core: boolean;
  is_wallet: boolean;
  time_at: number;
  amount: number;
  raw_amount?: number;
  raw_amount_str?: string;
  claimable_amount?: number; // for vesting tokens
};

export enum DebankProtocolDetailTypes {
  COMMON = 'common',
  LOCKED = 'locked',
  LENDING = 'lending',
  LEVERAGED_FARMING = 'leveraged_farming',
  VESTING = 'vesting',
  REWARD = 'reward',
  OPTIONS_SELLER = 'options_seller',
  OPTIONS_BUYER = 'options_buyer',
  PERPETUALS = 'perpetuals',
  INSURANCE_SELLER = 'insurance_seller',
  INSURANCE_BUYER = 'insurance_buyer',
}

export type DebankPortfolioItemObject = {
  stats: {
    asset_usd_value: number;
    debt_usd_value: number;
    net_usd_value: number;
  };
  update_at: number;
  name: string;
  detail_types: DebankProtocolDetailTypes[];
  detail: {
    supply_token_list?: DebankTokenObject[];
    reward_token_list?: DebankTokenObject[];
    borrow_token_list?: DebankTokenObject[];
    unlock_at?: number;
    health_rate?: number;
    debt_ratio?: number;
    daily_unlock_amount?: number;
    end_at?: number;

    // Optional detail properties: https://docs.open.debank.com/en/reference/api-models/portfolioitemobject#locked-locked-position

    // For reward items:
    token_list?: DebankTokenObject[];

    // For vesting protocols
    token?: DebankTokenObject;

    // For Options Seller / Options Buyer
    strike_token?: DebankTokenObject;
    underlying_token?: DebankTokenObject;
    collateral_token_list?: DebankTokenObject[];

    // For perpetuals:
    pnl_usd_value?: number;

    type?: number | string;
    style?: 'American' | 'European';
    exercise_start_at?: number;
    exercise_end_at?: number;
    is_auto_exercise?: boolean;
    exercise_profit?: number;
    usd_value?: number;
    description?: string;
    expired_at?: number;
    side?: 'Long' | 'Short';
    base_token?: DebankTokenObject;
    quote_token?: DebankTokenObject;
    position_token?: DebankTokenObject;
    margin_token?: DebankTokenObject;
    margin_rate?: { amount: number };
    leverage?: DebankTokenObject;
    daily_funding_rate?: DebankTokenObject;
    entry_price?: DebankTokenObject;
    mark_price?: DebankTokenObject;
    liquidation_price?: DebankTokenObject;
  };
};

export type DebankComplexProtocol = {
  id: string;
  chain: string;
  name: string;
  site_url: string;
  logo_url: string;
  has_supported_portfolio: boolean;
  tvl: number;
  portfolio_item_list: DebankPortfolioItemObject[];
};
