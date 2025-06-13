import { Typography } from '@/components/Typography';
import {
  Button,
  ListItem,
  listItemClasses,
  ListItemIcon,
  Stack,
  TypographyProps,
  styled,
  toast,
  Tooltip,
  truncateAddress,
} from '@avalabs/k2-alpine';
import { stripAddressPrefix } from '@core/common';
import { ComponentType, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IconBaseProps } from 'react-icons';

type Props = {
  Icon: ComponentType<IconBaseProps>;
  label: string;
  labelVariant?: TypographyProps['variant'];
  address: string | undefined;
  onClick?: VoidFunction;
  copyActionVisibility?: 'always' | 'hover';
};

const ItemIcon = styled(ListItemIcon)({
  minWidth: 36,
});

export const AddressItem: FC<Props> = ({
  Icon,
  label,
  labelVariant = 'caption',
  address,
  onClick,
  copyActionVisibility = 'hover',
}) => {
  const { t } = useTranslation();

  if (!address) {
    return null;
  }

  const strippedAddress = stripAddressPrefix(address);
  const CopyActionButton =
    copyActionVisibility === 'always' ? CopyButton : GhostCopyButton;

  return (
    <ListItem>
      <ItemIcon>
        <Icon />
      </ItemIcon>
      <Stack direction="column" gap={0} marginInlineEnd={1}>
        <Typography variant={labelVariant}>{label}</Typography>
        <Tooltip title={strippedAddress} enterDelay={1000}>
          <Typography variant="monospace10" color="text.secondary">
            {truncateAddress(strippedAddress)}
          </Typography>
        </Tooltip>
      </Stack>
      <CopyActionButton
        variant="contained"
        color="secondary"
        size="small"
        onClick={() => {
          navigator.clipboard.writeText(address);
          toast.success(t('Address copied!'), {
            id: 'address-copied',
          });
          onClick?.();
        }}
      >
        Copy
      </CopyActionButton>
    </ListItem>
  );
};

const CopyButton = styled(Button)({
  marginInlineStart: 'auto',
});

const GhostCopyButton = styled(CopyButton)(({ theme }) => ({
  opacity: 0,
  transition: theme.transitions.create(['opacity']),

  [`.${listItemClasses.root}:hover &`]: {
    opacity: 1,
  },
}));
