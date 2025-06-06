import {
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  truncateAddress,
  Tooltip,
  Stack,
  PopoverPosition,
} from '@avalabs/k2-alpine';
import { MdCheck } from 'react-icons/md';
import { FC, useState } from 'react';
import { PrimaryAccount } from '@core/types';
import {
  useBalanceTotalInCurrency,
  useBalancesContext,
  useSettingsContext,
} from '@core/ui';
import { Typography } from '@/components/Typography';
import { useTranslation } from 'react-i18next';
import * as Styled from './Styled';
import { AccountContextMenu } from './AccountContextMenu';

interface Props {
  account: PrimaryAccount;
  selected: boolean;
  onSelect: (account: PrimaryAccount['id']) => void;
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
      <ListItemButton
        onClick={() => onSelect(account.id)}
        onContextMenu={(e) => {
          e.preventDefault();
          setPosition({ top: e.clientY, left: e.clientX });
        }}
        sx={({ spacing, palette }) => ({
          backgroundColor: selected
            ? // @ts-expect-error Theme palette is not typed correctly
              palette.surface.secondary
            : // @ts-expect-error Theme palette is not typed correctly
              palette.surface.primary,
          gap: spacing(0.75),
          paddingLeft: spacing(0.25),
          paddingRight: spacing(2),
          borderRadius: 1,
        })}
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
      </ListItemButton>
      <AccountContextMenu
        account={account}
        position={position}
        onClose={() => setPosition(undefined)}
      />
    </ListItem>
  );
};

export default AccountListItem;
