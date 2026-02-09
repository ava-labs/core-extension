import { useState } from 'react';
import { DEFAULT_SLIPPAGE } from '../../fusion-config';

/**
 * Returns currently configured slippage
 */
export const useSlippageTolerance = () => {
  const [slippage, setSlippage] = useState(DEFAULT_SLIPPAGE);
  const [autoSlippage, setAutoSlippage] = useState(true);

  return {
    slippage,
    setSlippage,
    autoSlippage,
    setAutoSlippage,
  };
};
