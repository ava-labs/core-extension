import { useTranslation } from 'react-i18next';
import { ServiceType } from '@avalabs/fusion-sdk';
import { Collapse, Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { MdErrorOutline } from 'react-icons/md';

import { useFusionState } from '../contexts';

export const SwapCctTransactionWarning = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { selectedQuote } = useFusionState();

  const shouldShowWarning =
    selectedQuote?.serviceType === ServiceType.AVALANCHE_CCT &&
    selectedQuote.amountIn > 0n;

  return (
    <Collapse in={shouldShowWarning} mountOnEnter unmountOnExit>
      <Stack
        direction="row"
        alignItems="flex-start"
        gap={1}
        color="error.main"
        textAlign="left"
        px={0.5}
        data-testid="fusion-avalanche-cct-transaction-warning"
      >
        <Stack flexShrink={0} pt={0.25}>
          <MdErrorOutline size={24} color={theme.palette.error.main} />
        </Stack>
        <Stack>
          <Typography variant="body2" color="error.main">
            {t('This swap will require two transactions.')}
          </Typography>
          <Typography variant="body2" color="error.main">
            {t('You will need to sign twice. One export and one import.')}
          </Typography>
        </Stack>
      </Stack>
    </Collapse>
  );
};
