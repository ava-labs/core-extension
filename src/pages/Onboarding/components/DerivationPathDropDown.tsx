import { DerivationPath } from '@avalabs/wallets-sdk';
import { useTranslation } from 'react-i18next';
import { CheckIcon, Stack, Typography, useTheme } from '@avalabs/k2-components';
import { Dropdown, DropdownItem } from '@src/components/common/Dropdown';

interface DerivationPathDropdownProps {
  onPathSelected: (path: DerivationPath) => void;
  pathSpec: DerivationPath;
  isDisabled: boolean;
}

export function DerivationPathDropdown({
  pathSpec,
  onPathSelected,
  isDisabled,
}: DerivationPathDropdownProps) {
  const { t } = useTranslation();
  const theme = useTheme();

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
                return <Typography>{t('Ledger Live')}</Typography>;
              case DerivationPath.BIP44:
                return <Typography>{t('BIP44 (Default)')}</Typography>;
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
            <Typography variant="body2">{t('BIP44 (Default)')}</Typography>
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
            <Typography variant="body2">{t('Ledger Live')}</Typography>
            {pathSpec === DerivationPath.LedgerLive && <CheckIcon />}
          </Stack>
        </DropdownItem>
      </Dropdown>
    </Stack>
  );
}
