import { Typography } from '@/components/Typography';
import {
  Button,
  listItemClasses,
  TypographyProps,
  styled,
  toast,
  Tooltip,
  truncateAddress,
} from '@avalabs/k2-alpine';
import { stripAddressPrefix } from '@core/common';
import { ComponentType, FC, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { IconBaseProps } from 'react-icons';
import { ChainListItem } from '../ChainListItem';

export type Props = {
  Icon: ComponentType<IconBaseProps> | ReactElement<IconBaseProps>;
  label: string;
  labelVariant?: TypographyProps['variant'];
  address: string | undefined;
  onClick?: VoidFunction;
  copyActionVisibility?: 'always' | 'hover';
  truncate?: boolean;
};

export const AddressItem: FC<Props> = ({
  Icon,
  label,
  labelVariant = 'caption',
  address,
  onClick,
  copyActionVisibility = 'hover',
  truncate = true,
}) => {
  const { t } = useTranslation();

  if (!address) {
    return null;
  }

  const strippedAddress = stripAddressPrefix(address);
  const CopyActionButton =
    copyActionVisibility === 'always' ? Button : HoverableButton;

  return (
    <ChainListItem
      Icon={Icon}
      label={label}
      labelVariant={labelVariant}
      subtitle={
        <Tooltip title={strippedAddress} enterDelay={1000}>
          <Typography
            variant="monospace10"
            color="text.secondary"
            sx={truncate ? undefined : { lineBreak: 'anywhere' }}
          >
            {truncate ? truncateAddress(strippedAddress) : strippedAddress}
          </Typography>
        </Tooltip>
      }
      action={
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
          {t('Copy')}
        </CopyActionButton>
      }
    />
  );
};

const HoverableButton = styled(Button)(({ theme }) => ({
  opacity: 0,
  transition: theme.transitions.create(['opacity']),

  [`.${listItemClasses.root}:hover &`]: {
    opacity: 1,
  },
}));
