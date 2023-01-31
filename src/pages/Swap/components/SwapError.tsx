import {
  HorizontalFlex,
  InfoIcon,
  Tooltip,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import BN from 'bn.js';
import { useTranslation } from 'react-i18next';

const TryAgainButton = styled.span`
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

  return (
    <HorizontalFlex>
      <Typography size={12} color={theme.colors.error}>
        {swapError.message ?? ''}
      </Typography>
      {swapError.hasTryAgain && (
        <>
          <Typography
            size={12}
            color={theme.colors.error}
            margin="0 4px"
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
          {swapError.errorInfo && (
            <Tooltip
              placement={'bottom'}
              content={
                <VerticalFlex>
                  <Typography size={12}>{swapError.errorInfo}</Typography>
                </VerticalFlex>
              }
            >
              <InfoIcon height="12px" color={theme.colors.error} />
            </Tooltip>
          )}
        </>
      )}
    </HorizontalFlex>
  );
}
