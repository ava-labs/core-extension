import QRCodeSVG from 'qrcode.react';
import { useCallback, useEffect } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router-dom';
import {
  Box,
  Collapse,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';

import { AddressType } from '@core/types';
import { stripAddressPrefix } from '@core/common';
import {
  useAccountsContext,
  useAnalyticsContext,
  useQueryParams,
} from '@core/ui';

import { CChainAddressDisclaimer } from '@/components/CChainAddressDisclaimer';
import { AddressSelector } from '@/components/AddressSelector';
import { AddressCopyBox } from './components';

export const Receive = () => {
  const theme = useTheme();
  const history = useHistory();
  const params = useQueryParams();
  const { t } = useTranslation();
  const {
    accounts: { active },
  } = useAccountsContext();
  const { capture } = useAnalyticsContext();

  useEffect(() => {
    capture('ReceivePageVisited');
    // the event should be captured exactly once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAddressTypeChange = useCallback(
    (type) => {
      const newParams = new URLSearchParams(params);

      newParams.set('addressType', type);

      history.replace({
        pathname: '/receive',
        search: newParams.toString(),
      });
    },
    [params, history],
  );

  if (!active) {
    return <Redirect to="/" />;
  }

  const addressType = (params.get('addressType') ?? 'C') as AddressType;
  const address = stripAddressPrefix(active[`address${addressType}`] ?? '');

  return (
    <Stack gap={2} height="100cqh" width={1} bgcolor="background.backdrop">
      <Stack direction="row" justifyContent="space-between" px={1} py={2}>
        <IconButton size="small" onClick={history.goBack}>
          <MdArrowBack size={24} />
        </IconButton>
      </Stack>
      <Stack px={1.5} flexGrow={1} pb={1.5}>
        <Stack gap={1}>
          <Typography variant="h2">{t('Receive crypto')}</Typography>
          <Typography variant="caption">
            {t(
              'To receive funds you can choose to share your unique QR code or address below with the sender.',
            )}
          </Typography>
        </Stack>
        <Stack
          px={2}
          flexGrow={1}
          alignItems="center"
          justifyContent="center"
          gap={1.5}
        >
          <AddressSelector
            account={active}
            type={addressType}
            onChange={onAddressTypeChange}
          />
          <Box
            p={1}
            bgcolor="#fff"
            borderRadius={theme.shape.mediumBorderRadius}
          >
            <QRCodeSVG
              renderAs="svg"
              level="H"
              size={158}
              bgColor="#fff"
              fgColor={theme.palette.neutral['850']}
              value={address}
            />
          </Box>
          <Collapse in={addressType === 'C'}>
            <CChainAddressDisclaimer />
          </Collapse>
        </Stack>
        <AddressCopyBox address={address} addressType={addressType} />
      </Stack>
    </Stack>
  );
};
