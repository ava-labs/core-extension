import { useState } from 'react';
import {
  ChevronUpIcon,
  Chip,
  Grow,
  IconButton,
  LedgerIcon,
  LoadingDotsIcon,
  PencilRoundIcon,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';

import { SecretType } from '@core/service-worker';
import { WalletDetails } from '@core/service-worker';

import { useAccountManager } from '../providers/AccountManagerProvider';
import { OverflowingTypography } from './OverflowingTypography';
import { useWalletRename } from '../hooks/useWalletRename';
import { useSettingsContext } from '@src/contexts/SettingsProvider';

const commonTransitionProps = {
  timeout: 200,
  easing: 'ease-in-out',
  appear: true,
};
type WalletHeaderProps = {
  isActive: boolean;
  isExpanded: boolean;
  isLoading: boolean;
  totalBalance?: number;
  hasBalanceError: boolean;
  toggle: () => void;
} & (
  | {
      walletDetails: WalletDetails;
      name?: never;
    }
  | { name: string; walletDetails?: never }
);

export default function WalletHeader({
  walletDetails,
  name,
  isActive,
  isExpanded,
  isLoading,
  totalBalance,
  toggle,
}: WalletHeaderProps) {
  const { t } = useTranslation();
  const { isManageMode } = useAccountManager();
  const { currencyFormatter } = useSettingsContext();
  const [isHovered, setIsHovered] = useState(false);

  const { prompt: promptRename, renderDialog: renameDialog } =
    useWalletRename(walletDetails);

  return (
    <Stack
      sx={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        pl: 2,
        pr: 1,
        py: 1,
        gap: 2,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Stack
        sx={{
          gap: 1,
          alignItems: 'center',
          flexDirection: 'row',
          minWidth: 0,
        }}
      >
        {(walletDetails?.type === SecretType.Ledger ||
          walletDetails?.type == SecretType.LedgerLive) && (
          <LedgerIcon size={16} />
        )}
        <OverflowingTypography
          variant="h6"
          fontSize={14}
          fontWeight={600}
          lineHeight="16px"
          data-testid="wallet-name"
        >
          {walletDetails?.name ?? name}
        </OverflowingTypography>
        <Grow in={isActive} unmountOnExit>
          <Chip
            size="small"
            sx={{ fontSize: 10, height: 16 }}
            color="success"
            label={t('Active')}
            data-testid="wallet-active-chip"
          />
        </Grow>
        {/* Section for the imported accounts has no WalletDetails, therefore cannot be renamed */}
        {walletDetails && (
          <Grow {...commonTransitionProps} in={isHovered && !isManageMode}>
            <IconButton size="small" onClick={promptRename}>
              <PencilRoundIcon size={16} />
            </IconButton>
          </Grow>
        )}
      </Stack>

      <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 0.5 }}>
        <Typography
          variant="caption"
          fontWeight={500}
          fontSize={14}
          textAlign="end"
          color="text.secondary"
        >
          {isLoading ? (
            <LoadingDotsIcon size={20} orientation="horizontal" />
          ) : typeof totalBalance === 'number' ? (
            currencyFormatter(totalBalance)
          ) : null}
        </Typography>
        <IconButton size="small" onClick={toggle}>
          <ChevronUpIcon
            size={16}
            sx={{
              transition: 'transform .2s ease-in-out',
              transform: isExpanded ? 'rotateX(0deg)' : 'rotateX(180deg)',
            }}
          />
        </IconButton>
      </Stack>
      {walletDetails && renameDialog()}
    </Stack>
  );
}
