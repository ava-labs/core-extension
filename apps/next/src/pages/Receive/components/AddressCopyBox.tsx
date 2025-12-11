import { useTranslation } from 'react-i18next';
import {
  Button,
  Stack,
  toast,
  Typography,
  TypographyProps,
} from '@avalabs/k2-alpine';

import { AddressType } from '@core/types';

import { Card } from '@/components/Card';
import { getChainLabelAndIconByAddressType } from '@/utils/getChainLabelAndIconByAddressType';

type Props = {
  address: string;
  addressType: AddressType;
  textProps?: TypographyProps;
};

export const AddressCopyBox = ({ address, addressType, textProps }: Props) => {
  const { t } = useTranslation();

  const { label: chainLabel, Icon: ChainIcon } =
    getChainLabelAndIconByAddressType(addressType);

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    toast.success(t('Address copied!'), {
      id: 'address-copied',
    });
  };

  return (
    <Card>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={1.5}
        py={1}
        px={1.5}
      >
        <Stack direction="row" alignItems="center" gap={1.5}>
          <ChainIcon size={32} />
          <Stack>
            <Typography variant="subtitle3">{chainLabel}</Typography>
            <Typography
              variant="mono2"
              sx={{ wordBreak: 'break-all' }}
              {...textProps}
            >
              {address}
            </Typography>
          </Stack>
        </Stack>
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={copyAddress}
        >
          {t('Copy')}
        </Button>
      </Stack>
    </Card>
  );
};
