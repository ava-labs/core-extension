import {
  Button,
  toast,
  Tooltip,
  Typography,
  TypographyProps,
} from '@avalabs/k2-alpine';
import { stripAddressPrefix, truncateAddress } from '@core/common';
import { ComponentType, FC, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { IconBaseProps } from 'react-icons';
import { ChainListItem } from './ChainListItem';
import { HoverableListItemButton } from './HoverableListItemButton';
import { AddressEnablerProps } from './types';

export type Props = {
  Icon: ComponentType<IconBaseProps> | ReactElement<IconBaseProps>;
  label: string;
  address: string | undefined;
  onClick?: VoidFunction;
  copyActionVisibility?: 'always' | 'hover';
  truncate?: boolean | number;
  AddressEnabler?: ComponentType<AddressEnablerProps>;
};

const DEFAULT_TRUNCATE_FRONT = 7;
const DEFAULT_TRUNCATE_BACK = 6;

export const AddressItem: FC<Props> = ({
  truncate = true,
  label,
  Icon,
  copyActionVisibility = 'hover',
  onClick,
  address,
  AddressEnabler,
}) => {
  const { t } = useTranslation();

  const labelVariant: TypographyProps['variant'] = 'subtitle3';

  if (!address) {
    return AddressEnabler ? (
      <AddressEnabler
        Icon={Icon}
        label={label}
        labelVariant={labelVariant}
        visibility={copyActionVisibility}
      />
    ) : null;
  }

  const strippedAddress = stripAddressPrefix(address);
  const CopyActionButton =
    copyActionVisibility === 'always' ? Button : HoverableListItemButton;

  return (
    <ChainListItem
      Icon={Icon}
      label={label}
      labelVariant={labelVariant}
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
