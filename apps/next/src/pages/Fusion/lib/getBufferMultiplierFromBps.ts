import { BASIS_POINTS_DIVISOR } from '~/vmModules/validators/swap';

/**
 * Converts a basis points value to a multiplier to be used for getting a padded amount.
 *
 * @example
 * 	getBufferMultiplierFromBps(5000) // 1.5 (5000bps = 50% buffer)
 * 	getBufferMultiplierFromBps('2000') // 1.5 (2000bps = 20% buffer)
 *
 * @param bps - The basis points value to convert to a multiplier.
 * @returns The multiplier.
 */
export const getBufferMultiplierFromBps = (bps: number | string): number => {
  const buffer = Number(bps) / BASIS_POINTS_DIVISOR;
  return 1 + buffer;
};
