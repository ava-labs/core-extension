import {
  Collapse,
  ListItemButton,
  MenuItem,
  Stack,
  Typography,
} from '@avalabs/k2-alpine';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown } from 'react-icons/fa';
import { FaChevronUp } from 'react-icons/fa6';

import { WalletIcon } from '@/components/WalletIcon';
import { HexagonalIcon } from '@/components/HexagonalIcon';

export const MyAccountsSection: FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <ListItemButton
        onClick={(ev) => {
          ev.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          gap={1}
          width="100%"
          justifyContent="space-between"
        >
          <Typography variant="subtitle3">{t('My accounts')}</Typography>
          {isOpen ? <FaChevronDown /> : <FaChevronUp />}
        </Stack>
      </ListItemButton>
      <Collapse in={isOpen}>
        <Stack pb={1}>
          {accounts.map((account) => (
            <MenuItem
              key={account.id}
              onClick={() => updateQueryParam(searchParams, 'from', account.id)}
              sx={{
                mx: 1,
                borderRadius: 1,
                py: 0.5,
                px: 0.5,
                minHeight: 'unset',
              }}
            >
              <Stack direction="row" alignItems="center" gap={1}>
                <HexagonalIcon size={32}>
                  <WalletIcon
                    type={account.walletType}
                    authProvider={account.authProvider}
                    expanded={account.isActiveWallet}
                  />
                </HexagonalIcon>
                <Stack>
                  <Typography variant="subtitle2" fontWeight="medium">
                    {account.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('from {{walletName}}', {
                      walletName: account.walletName,
                    })}
                  </Typography>
                </Stack>
              </Stack>
            </MenuItem>
          ))}
        </Stack>
      </Collapse>
    </>
  );
};
