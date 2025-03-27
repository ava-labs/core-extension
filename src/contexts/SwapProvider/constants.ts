/**
 * The address where ParaSwap will send collected partner fees.
 */
export const PARASWAP_PARTNER_ADDRESS =
  '0xcEA3b9415F269B5686403909d781959570f32CF0';

/**
 * The fee percentage that Core gathers on ParaSwap swaps.
 *
 * An integer representing the basis points (BPS) of the fee percentage.
 *
 * @example 85 -> 0.85%
 */
export const PARASWAP_PARTNER_FEE_BPS = 85 as const satisfies number;

/**
 * The address ParaSwap uses for EVM native tokens.
 */
export const NATIVE_TOKEN_ADDRESS =
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
