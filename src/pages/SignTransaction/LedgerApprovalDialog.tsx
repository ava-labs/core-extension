import {
  HorizontalSeparator,
  LoadingSpinnerIcon,
  Card,
  truncateAddress,
  Typography,
  VerticalFlex,
  HorizontalFlex,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { t } from 'i18next';

interface LedgerApprovalDialogProps {
  address?: string;
  amount?: string;
  symbol?: string;
  fee?: string;
  feeSymbol?: string;
  nftName?: string;
}

const StyledCard = styled(Card)`
  margin: 16px 0 0 0;
  radius: 8px;
  padding: 16px;
  background-color: ${({ theme }) => `${theme.colors.bg3}80`};
`;

export function LedgerApprovalDialog({
  address,
  amount,
  symbol,
  fee,
  feeSymbol,
  nftName,
}: LedgerApprovalDialogProps) {
  const theme = useTheme();
  return (
    <VerticalFlex
      width="337px"
      align="center"
      padding="16px"
      radius={theme.borderRadius}
      background={theme.colors.bg2}
    >
      <Typography weight={600} size={18} height="22px">
        {t('Approve on your Ledger')}
      </Typography>
      <StyledCard>
        <VerticalFlex width="100%">
          {address && (
            <VerticalFlex>
              <Typography height="17px" size={14} margin="0 0 4px 0">
                {t('To')}
              </Typography>
              <Typography height="24px" weight={600}>
                {truncateAddress(address, 24)}
              </Typography>
            </VerticalFlex>
          )}
          <HorizontalSeparator margin="16px 0" />
          {amount && (
            <>
              <VerticalFlex>
                <Typography height="17px" size={14} margin="0 0 4px 0">
                  {t('Amount')}
                </Typography>
                <Typography height="24px" weight={600}>
                  {amount} {symbol}
                </Typography>
              </VerticalFlex>
              <HorizontalSeparator margin="16px 0" />
            </>
          )}
          {fee && (
            <>
              <VerticalFlex>
                <Typography height="17px" size={14} margin="0 0 4px 0">
                  {t('Fee')}
                </Typography>
                <Typography height="24px" weight={600}>
                  {fee} {feeSymbol}
                </Typography>
              </VerticalFlex>
              <HorizontalSeparator margin="16px 0" />
            </>
          )}
          {nftName && (
            <>
              <VerticalFlex>
                <Typography height="17px" size={14} margin="0 0 4px 0">
                  {t('Collectible')}
                </Typography>
                <Typography height="24px" weight={600}>
                  {nftName}
                </Typography>
              </VerticalFlex>
              <HorizontalSeparator margin="16px 0" />
            </>
          )}
          <VerticalFlex>
            <Typography
              height="17px"
              size={14}
              margin="0 0 4px 0"
              align="center"
            >
              {t('Status')}
            </Typography>
            <HorizontalFlex justify="center" margin="8px 0 0 0">
              <LoadingSpinnerIcon
                color={theme.colors.icon1}
                height="32px"
                width="32px"
              />
            </HorizontalFlex>
          </VerticalFlex>
        </VerticalFlex>
      </StyledCard>
    </VerticalFlex>
  );
}
