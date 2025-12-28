/**
 * The fee percentage that Core gathers on Markr swaps.
 * An integer representing the basis points (BPS) of the fee percentage.
 * @example 85 -> 0.85%
 */
export const MARKR_PARTNER_FEE_BPS = 85;

/**
 * Divisor for converting basis points to decimal percentage.
 * @example 100 BPS / 10_000 = 0.01 = 1%
 */
export const BASIS_POINTS_DIVISOR = 10_000;
