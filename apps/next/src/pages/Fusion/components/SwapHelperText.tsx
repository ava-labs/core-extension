import { Collapse, Stack } from '@avalabs/k2-alpine';

import { isNativeToken } from '@core/types';

import { useFusionState } from '../contexts';
import { useAdditiveFeesAmount } from '../hooks/useAdditiveFeesAmount';

import { SwapErrorMessage } from './SwapErrorMessage';
import { AdditiveFeesNotice } from './AdditiveFeesNotice';

/**
 * Ensures only one of <AdditiveFeesNotice /> or <SwapErrorMEssage /> is displayed at a time.
 * Also ensures that any errors take priority over the fees notice.
 */
export const SwapHelperText = () => {
  const { formError, sourceToken } = useFusionState();
  const { sum, symbol } = useAdditiveFeesAmount();
  const isFormErrorVisible = Boolean(formError);
  const isAdditiveFeesVisible =
    !isFormErrorVisible && Boolean(sum) && Boolean(symbol);

  return (
    <Stack>
      <Collapse in={isFormErrorVisible} appear unmountOnExit={false}>
        <SwapErrorMessage formError={formError} />
      </Collapse>
      <Collapse in={isAdditiveFeesVisible} appear unmountOnExit={false}>
        <AdditiveFeesNotice
          sum={sum}
          symbol={symbol}
          isNativeToken={sourceToken ? isNativeToken(sourceToken) : false}
        />
      </Collapse>
    </Stack>
  );
};
