import {
  Button,
  listItemClasses,
  styled,
  toast,
  Tooltip,
  Typography,
} from '@avalabs/k2-alpine';
import { stripAddressPrefix, truncateAddress } from '@core/common';
import { ComponentType, FC, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { IconBaseProps } from 'react-icons';
import { ChainListItem } from './ChainListItem';

export type Props = {
  Icon: ComponentType<IconBaseProps> | ReactElement<IconBaseProps>;
  label: string;
  address: string | undefined;
  onClick?: VoidFunction;
  copyActionVisibility?: 'always' | 'hover';
  truncate?: boolean | number;
};

const DEFAULT_TRUNCATE_FRONT = 7;
const DEFAULT_TRUNCATE_BACK = 6;

export const AddressItem: FC<Props> = ({
  Icon,
  label,
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
      labelVariant="subtitle3"
      subtitle={
        <Tooltip title={strippedAddress} enterDelay={1000}>
          <Typography
            variant="mono2"
            color="text.secondary"
            sx={truncate ? undefined : { lineBreak: 'anywhere' }}
          >
            {truncate
              ? truncateAddress(
                  strippedAddress,
                  typeof truncate === 'number'
                    ? truncate
                    : DEFAULT_TRUNCATE_FRONT,
                  DEFAULT_TRUNCATE_BACK,
                )
              : strippedAddress}
          </Typography>
        </Tooltip>
      }
      action={
        <CopyActionButton
          variant="contained"
          color="secondary"
          size="xsmall"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            navigator.clipboard.writeText(strippedAddress);
            toast.success(t('Address copied!'), {
              id: 'address-copied',
              duration: 1000,
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
