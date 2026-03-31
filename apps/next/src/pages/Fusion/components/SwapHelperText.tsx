import { Collapse, Stack } from '@avalabs/k2-alpine';
import { bigIntToString } from '@avalabs/core-utils-sdk';

import { useFusionState } from '../contexts';
import { sumByPurpose } from '../lib/sumByPurpose';

import { SwapErrorMessage } from './SwapErrorMessage';
import { AdditiveFeesNotice } from './AdditiveFeesNotice';

/**
 * Ensures only one of <AdditiveFeesNotice /> or <SwapErrorMEssage /> is displayed at a time.
 * Also ensures that any errors take priority over the fees notice.
 */
export const SwapHelperText = () => {
  const { formError, currentRequiredTokens } = useFusionState();
  const isFormErrorVisible = Boolean(formError);
  const additiveFeesTokens = currentRequiredTokens.tokens.filter((token) =>
    token.amounts.some(([_, purpose]) => purpose === 'additive-fee'),
  );
  const isAdditiveFeesVisible =
    !isFormErrorVisible && additiveFeesTokens.length > 0;

  return (
    <Stack>
      <Collapse in={isFormErrorVisible} appear unmountOnExit={false}>
        <SwapErrorMessage formError={formError} />
      </Collapse>
      <Collapse in={isAdditiveFeesVisible} appear unmountOnExit={false}>
        {additiveFeesTokens.map((token) => (
          <AdditiveFeesNotice
            key={token.id}
            sum={bigIntToString(
              sumByPurpose(token, 'additive-fee'),
              token.token.decimals,
            )}
            symbol={token.token.symbol}
          />
        ))}
      </Collapse>
    </Stack>
  );
};
