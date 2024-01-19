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

export interface Collection {
  id: string;
  chain: string;
  name: string;
  description: string | null;
  logo_url: string;
  is_verified: boolean;
  credit_score: number;
  is_scam: boolean;
  is_suspicious: boolean;
  is_core: boolean;
  floor_price: number;
  tokens?: DebankNFTItem[];
  is_erc1155?: boolean;
  is_erc721?: boolean;
}

export interface DebankNFTItem {
  id: string;
  contract_id: string;
  inner_id: string;
  chain: string;
  symbol: string;
  name: string;
  description: string;
  content_type: 'image' | 'image_url' | 'video_url' | 'audio_url';
  content: string;
  thumbnail_url: string;
  total_supply?: number;
  attributes: {
    trait_type: string;
    value: string | number;
  }[];
  detail_url: string;
  collection_id?: string;
  is_erc1155?: boolean;
  is_erc721: boolean;
  pay_token: {
    id: string;
    name: string;
    symbol?: string;
    amount: number;
    logo_url?: string;
    time_at: number;
    date_at?: string;
    price?: number;
  };
  usd_price: number;
  collection?: Collection | null;
  amount?: number;
}

export type DebankTokenItem = {
  content_type?: 'image' | 'image_url' | 'video_url' | 'audio_url' | undefined;
  content?: string | undefined;
  inner_id?: any;
  amount: number;
  chain: string;
  decimals: number;
  display_symbol: string | null;
  id: string;
  is_core: boolean;
  is_verified: boolean;
  is_wallet: boolean;
  is_scam?: boolean;
  is_infinity?: boolean;
  is_suspicious?: boolean;
  logo_url: string;
  name: string;
  optimized_symbol: string;
  price: number;
  symbol: string;
  time_at: number;
  usd_value?: number;
  raw_amount?: string;
  raw_amount_hex_str?: string;
  price_24h_change?: number | null;
};

export interface DebankPortfolioTokenItem extends DebankTokenItem {
  claimable_amount?: number;
}

export type DebankNftObject = {
  chain: string;
  collection: {
    id: string;
    name: string;
    create_at: number;
    chains: string[];
    is_suspicious?: boolean;
    is_verified?: boolean;
    floor_price?: number | null;
  };
  content: string;
  content_type: 'image' | 'image_url' | 'video_url' | 'audio_url';
  contract_id: string;
  description: string | null;
  detail_url: string;
  id: string;
  inner_id: string;
  name: string;
  total_supply: number;
  amount: number;
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
    supply_token_list?: DebankPortfolioTokenItem[];
    reward_token_list?: DebankPortfolioTokenItem[];
    borrow_token_list?: DebankPortfolioTokenItem[];
    unlock_at?: number;
    health_rate?: number;
    debt_ratio?: number;
    daily_unlock_amount?: number;
    end_at?: number;

    // Optional detail properties: https://docs.open.debank.com/en/reference/api-models/portfolioitemobject#locked-locked-position

    // For reward items:
    token_list?: DebankPortfolioTokenItem[];

    // For vesting protocols
    token?: DebankPortfolioTokenItem;

    // For Options Seller / Options Buyer
    strike_token?: DebankPortfolioTokenItem;
    underlying_token?: DebankPortfolioTokenItem;
    collateral_token_list?: DebankPortfolioTokenItem[];

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
    base_token?: DebankPortfolioTokenItem;
    quote_token?: DebankPortfolioTokenItem;
    position_token?: DebankPortfolioTokenItem;
    margin_token?: DebankPortfolioTokenItem;
    margin_rate?: { amount: number };
    leverage?: number;
    daily_funding_rate?: number;
    entry_price?: number;
    mark_price?: number;
    liquidation_price?: number;
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

export type DebankTxPreExecutionResult = {
  balance_change: {
    success: boolean;
    error: null | {
      code: number;
      message: string;
    };
    send_token_list: DebankTokenItem[];
    receive_token_list: DebankTokenItem[];
    send_nft_list: DebankNFTItem[];
    receive_nft_list: DebankNFTItem[];
    usd_value_change: number;
  };
  gas: {
    success?: boolean;
    error?: {
      code: number;
      msg: string;
    } | null;
    gas_used: number;
    gas_limit: number;
  };
  is_multisig: boolean;
  multisig?: any;
  pre_exec: {
    success: boolean;
    error?: {
      code: number;
      msg: string;
    } | null;
  };
};

export type DebankTransactionData = {
  from: string;
  to: string;
  data: string;
  value: string;
  chainId: number;
  nonce: string;
  gas: string;
  gasPrice?: string;
};

export interface SendTokenAction {
  type: 'send_token';
  from_addr: string;
  to_addr: string;
  token: DebankTokenItem;
}

export interface SendNftAction {
  type: 'send_nft';
  from_addr: string;
  to_addr: string;
  nft: DebankNFTItem;
}

export interface ApproveTokenAction {
  type: 'approve_token' | 'revoke_token_approval';
  owner: string;
  spender: {
    id: string; //spender address
    protocol: {
      id: string;
      name: string;
      logo_url: string;
    };
  };
  token: DebankTokenItem;
}

export interface ApproveNftAction {
  type: 'approve_nft' | 'revoke_nft_approval';
  owner: string;
  spender: {
    id: string; //spender address
    protocol: {
      id: string;
      name: string;
      logo_url: string;
    };
  };
  nft: DebankNFTItem;
}

export interface ApproveNftCollectionAction {
  type: 'approve_nft_collection' | 'revoke_nft_collection_approval';
  owner: string;
  spender: {
    id: string; //spender address
    protocol: {
      id: string;
      name: string;
      logo_url: string;
    };
  };
  collection: Collection;
}

export interface CancelTxAction {
  type: 'cancel_tx';
  from_addr: string;
}
export interface DeployContractAction {
  type: 'deploy_contract';
  from_addr: string;
}
export interface CallAction {
  type: 'call';
  from_addr: string;
  to_addr: string;
  contract: {
    id: string;
    protocol: {
      logo_url: string;
      name: string;
      id: string;
    };
  };
}

export type TxAction =
  | SendTokenAction
  | SendNftAction
  | ApproveTokenAction
  | ApproveNftAction
  | ApproveNftCollectionAction
  | CancelTxAction
  | DeployContractAction
  | CallAction;

export interface ExplainTxResponse {
  actions?: TxAction[];
  abi?: {
    func: string;
    params: unknown[];
  };
}
