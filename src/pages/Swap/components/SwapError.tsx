import BN from 'bn.js';
import { useTranslation } from 'react-i18next';
import {
  InfoCircleIcon,
  Stack,
  Typography,
  Tooltip,
  styled,
  useTheme,
} from '@avalabs/core-k2-components';

const TryAgainButton = styled('span')`
  text-decoration: underline;
  cursor: pointer;
`;

export function SwapError({
  swapError,
  destinationInputField,
  fromTokenValue,
  toTokenValue,
  calculateTokenValueToInput,
  selectedFromToken,
  selectedToToken,
}) {
  const theme = useTheme();
  const { t } = useTranslation();

  const errorTitle = swapError?.errorInfo?.message || swapError?.message || '';

  return (
    <Stack sx={{ flexDirection: 'row', flexGrow: 0, alignItems: 'center' }}>
      <Typography variant="caption" sx={{ color: theme.palette.error.main }}>
        {swapError.message ?? ''}
      </Typography>
      {swapError.hasTryAgain && (
        <>
          <Typography
            variant="caption"
            sx={{ my: 0, mx: 0.5, color: theme.palette.error.main }}
            onClick={() => {
              const value =
                destinationInputField === 'to'
                  ? fromTokenValue || { bn: new BN(0), amount: '0' }
                  : toTokenValue || { bn: new BN(0), amount: '0' };
              calculateTokenValueToInput(
                value,
                destinationInputField || 'to',
                selectedFromToken,
                selectedToToken
              );
            }}
          >
            <TryAgainButton>{t('try again')}</TryAgainButton>
          </Typography>
          {errorTitle && (
            <Tooltip placement={'bottom'} title={errorTitle}>
              <InfoCircleIcon
                size="12px"
                sx={{ color: theme.palette.error.main }}
              />
            </Tooltip>
          )}
        </>
      )}
    </Stack>
  );
}
