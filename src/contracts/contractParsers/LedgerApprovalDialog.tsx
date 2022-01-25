import {
  HorizontalSeparator,
  LoadingSpinnerIcon,
  SecondaryCard,
  truncateAddress,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';

interface LedgerApprovalDialogProps {
  address?: string;
  amount?: string;
  symbol?: string;
  fee?: string;
}

const StyledCard = styled(SecondaryCard)`
  margin: 24px 0 0 0;
  radius: 8px;
  padding: 16px;
  background-color: ${({ theme }) => `${theme.colors.bg3}80`};
`;

export function LedgerApprovalDialog({
  address,
  amount,
  symbol,
  fee,
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
      <Typography weight={700} size={18}>
        Approve on your Ledger
      </Typography>
      <StyledCard>
        <VerticalFlex width="100%">
          {address && (
            <VerticalFlex>
              <Typography height="17px" size={14} margin="0 0 4px 0">
                To
              </Typography>
              <Typography height="24px" weight={600}>
                {truncateAddress(address, 24)}
              </Typography>
            </VerticalFlex>
          )}
          <HorizontalSeparator margin="16px 0" />
          {amount && (
            <VerticalFlex>
              <Typography height="17px" size={14} margin="0 0 4px 0">
                Amount
              </Typography>
              <Typography height="24px" weight={600}>
                {amount} {symbol}
              </Typography>
            </VerticalFlex>
          )}
          <HorizontalSeparator margin="16px 0" />
          {fee && (
            <VerticalFlex>
              <Typography height="17px" size={14} margin="0 0 4px 0">
                Fee
              </Typography>
              <Typography height="24px" weight={600}>
                {fee} AVAX
              </Typography>
            </VerticalFlex>
          )}
          <HorizontalSeparator margin="16px 0" />
          <VerticalFlex>
            <Typography height="17px" size={14} margin="0 0 4px 0">
              Status
            </Typography>
            <LoadingSpinnerIcon
              color={theme.colors.icon1}
              height="32px"
              width="32px"
            />
          </VerticalFlex>
        </VerticalFlex>
      </StyledCard>
    </VerticalFlex>
  );
}
