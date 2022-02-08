import {
  CheckmarkIcon,
  HorizontalFlex,
  LoadingSpinnerIcon,
  SecondaryCard,
  SubTextTypography,
  Typography,
  VerticalFlex,
  WarningIcon,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';

const LedgerCard = styled(SecondaryCard)<{
  clickable: boolean;
}>`
  background-color: ${({ theme }) => `${theme.colors.bg3}80`};
  border-radius: 8px;
  padding: 24px;
  width: 343px;
  ${({ clickable }) => clickable && `cursor: pointer;`};
`;

export enum LedgerStatus {
  LEDGER_LOADING = 'loading',
  LEDGER_CONNECTED = 'connected',
  LEDGER_CONNECTION_FAILED = 'failed',
}

export function LedgerConnectCard({
  path,
  status,
  onClick,
}: {
  path: string;
  status: LedgerStatus;
  onClick: () => void;
}) {
  const theme = useTheme();
  const isErrorStatus = LedgerStatus.LEDGER_CONNECTION_FAILED === status;

  return (
    <LedgerCard onClick={onClick} clickable={isErrorStatus}>
      <HorizontalFlex width="100%" align="center" justify="space-between">
        <VerticalFlex>
          <SubTextTypography size={16} height="24px">
            Derivation Path
          </SubTextTypography>
          <Typography margin="4px 0 0" size={24} height="29px" weight={700}>
            {path}
          </Typography>
        </VerticalFlex>
        {/* Icon here */}
        {{
          [LedgerStatus.LEDGER_LOADING]: (
            <LoadingSpinnerIcon height="24px" color={theme.colors.icon1} />
          ),
          [LedgerStatus.LEDGER_CONNECTED]: (
            <CheckmarkIcon height="24px" color={theme.colors.icon1} />
          ),
          [LedgerStatus.LEDGER_CONNECTION_FAILED]: (
            <WarningIcon height="24px" color={theme.colors.icon1} />
          ),
        }[status] || null}
      </HorizontalFlex>
    </LedgerCard>
  );
}
