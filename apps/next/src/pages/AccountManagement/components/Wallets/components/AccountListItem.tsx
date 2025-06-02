import {
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  truncateAddress,
} from '@avalabs/k2-alpine';
import { MdCheck } from 'react-icons/md';
import { FC } from 'react';
import { PrimaryAccount } from '@core/types';
import { useBalanceTotalInCurrency, useSettingsContext } from '@core/ui';
import { Typography } from '../../Typography';
import * as Styled from './Styled';

interface Props {
  account: PrimaryAccount;
  selected: boolean;
  onSelect: (account: PrimaryAccount['id']) => void;
}

const AccountListItem: FC<Props> = ({ account, selected, onSelect }) => {
  const { currencyFormatter } = useSettingsContext();
  const balance = useBalanceTotalInCurrency(account);
  const BalanceText = selected ? Typography : Styled.FadedText;

  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={() => onSelect(account.id)}
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
            <Typography variant="monospace" color="text.secondary">
              {truncateAddress(account.addressC)}
            </Typography>
          }
        />
        <ListItemText
          sx={{ flexGrow: 0 }}
          primary={
            <BalanceText variant="title">
              {currencyFormatter(balance?.sum ?? 0)}
            </BalanceText>
          }
        />
      </ListItemButton>
    </ListItem>
  );
};

export default AccountListItem;
