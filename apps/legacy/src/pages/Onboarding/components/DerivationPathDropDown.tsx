import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { useTranslation } from 'react-i18next';
import {
  CheckIcon,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import { Dropdown, DropdownItem } from '@/components/common/Dropdown';

interface DerivationPathDropdownProps {
  onPathSelected: (path: DerivationPath) => void;
  pathSpec: DerivationPath;
  isDisabled: boolean;
  isEditScreen?: boolean;
}

export function DerivationPathDropdown({
  pathSpec,
  onPathSelected,
  isDisabled,
  isEditScreen,
}: DerivationPathDropdownProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const hasBIP44AddedAlready =
    isEditScreen && pathSpec === DerivationPath.BIP44;

  const hasLedgerLiveAddedAlready =
    isEditScreen && pathSpec === DerivationPath.LedgerLive;

  const bip44Label = hasBIP44AddedAlready
    ? t('BIP44 (Current)')
    : t('BIP44 (Default)');
  const ledgerLiveLabel = hasLedgerLiveAddedAlready
    ? t('Ledger Live (Current)')
    : t('Ledger Live');

  return (
    <Stack>
      <Dropdown
        defaultValue={pathSpec}
        inputProps={{
          MenuProps: {
            MenuListProps: {
              sx: {
                backgroundColor: theme.palette.grey[850],
              },
            },
          },
        }}
        SelectProps={{
          defaultValue: '',
          native: false,
          displayEmpty: true,
          renderValue: () => {
            switch (pathSpec) {
              case DerivationPath.LedgerLive:
                return <Typography>{ledgerLiveLabel}</Typography>;
              case DerivationPath.BIP44:
                return <Typography>{bip44Label}</Typography>;
            }
          },
          onChange: (e) => {
            const path = e.target.value;
            if (path && path !== pathSpec) {
              onPathSelected(path as DerivationPath);
            }
          },
        }}
        label={t('Select derivation path')}
        InputProps={{ disabled: isDisabled }}
      >
        <DropdownItem
          value={DerivationPath.BIP44}
          selected={pathSpec === DerivationPath.BIP44}
          data-testid="connect-account-menu-item"
        >
          <Stack
            sx={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Typography variant="body2">{bip44Label}</Typography>
            {pathSpec === DerivationPath.BIP44 && <CheckIcon />}
          </Stack>
        </DropdownItem>

        <DropdownItem
          value={DerivationPath.LedgerLive}
          selected={pathSpec === DerivationPath.LedgerLive}
          data-testid="connect-account-menu-item"
        >
          <Stack
            sx={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Typography variant="body2">{ledgerLiveLabel}</Typography>
            {pathSpec === DerivationPath.LedgerLive && <CheckIcon />}
          </Stack>
        </DropdownItem>
      </Dropdown>
    </Stack>
  );
}
