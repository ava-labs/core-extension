import { Typography } from '@/components/Typography';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  PopoverPosition,
  Stack,
  Tooltip,
  truncateAddress,
} from '@avalabs/k2-alpine';
import { Account } from '@core/types';
import {
  useBalanceTotalInCurrency,
  useBalancesContext,
  useSettingsContext,
} from '@core/ui';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdCheck } from 'react-icons/md';
import { AccountContextMenu } from './AccountContextMenu';
import * as Styled from './Styled';

interface Props {
  account: Account;
  selected: boolean;
  onSelect: (account: Account['id']) => void;
}

const AccountListItem: FC<Props> = ({ account, selected, onSelect }) => {
  const { t } = useTranslation();
  const { currencyFormatter } = useSettingsContext();
  const balance = useBalanceTotalInCurrency(account);
  const { isTokensCached } = useBalancesContext();
  const [position, setPosition] = useState<PopoverPosition | undefined>(
    undefined,
  );

  return (
    <ListItem disablePadding>
      <Styled.ListItemButton
        selected={selected}
        onClick={() => onSelect(account.id)}
        onContextMenu={(e) => {
          e.preventDefault();
          setPosition({ top: e.clientY, left: e.clientX });
        }}
      >
        <ListItemIcon sx={{ minWidth: 'unset ' }}>
          <MdCheck
            size={24}
            color={selected ? 'currentColor' : 'transparent'}
          />
        </ListItemIcon>
        <ListItemText
          primary={<Typography variant="title">{account.name}</Typography>}
          secondary={
            <Tooltip title={account.addressC} enterDelay={1000}>
              <Typography
                variant="monospace"
                color="text.secondary"
                component="span"
              >
                {truncateAddress(account.addressC)}
              </Typography>
            </Tooltip>
          }
        />
        <ListItemText
          sx={{ flexGrow: 0 }}
          primary={
            <Stack direction="row" alignItems="center" gap={0.5}>
              {isTokensCached && (
                <Tooltip
                  title={t('Balances loading...')}
                  placement="bottom"
                  color="error"
                >
                  <Styled.ErrorIcon size={14} />
                </Tooltip>
              )}
              <Typography
                variant="title"
                component="span"
                color={selected ? 'text.primary' : 'text.disabled'}
              >
                {currencyFormatter(balance?.sum ?? 0)}
              </Typography>
            </Stack>
          }
        />
      </Styled.ListItemButton>
      <AccountContextMenu
        account={account}
        position={position}
        onClose={() => setPosition(undefined)}
      />
    </ListItem>
  );
};

export default AccountListItem;
