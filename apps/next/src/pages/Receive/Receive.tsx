import QRCodeSVG from 'qrcode.react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import { Box, Collapse, Stack, useTheme } from '@avalabs/k2-alpine';

import { AddressType } from '@core/types';
import { stripAddressPrefix } from '@core/common';
import {
  useAccountsContext,
  useAnalyticsContext,
  useNavigation,
  useQueryParams,
} from '@core/ui';

import { CChainAddressDisclaimer } from '@/components/CChainAddressDisclaimer';
import { AddressSelector } from '@/components/AddressSelector';
import { AddressCopyBox } from './components';
import { Page } from '@/components/Page';

export const Receive = () => {
  const theme = useTheme();
  const history = useNavigation();
  const params = useQueryParams();
  const { t } = useTranslation();
  const {
    accounts: { active },
  } = useAccountsContext();
  const { capture } = useAnalyticsContext();

  const onAddressTypeChange = useCallback(
    (type: AddressType) => {
      capture('TokenReceiveClicked', { addressType: type });
      const newParams = new URLSearchParams(params);

      newParams.set('addressType', type);

      history.replace({
        pathname: '/receive',
        search: newParams.toString(),
      });
    },
    [capture, params, history],
  );

  if (!active) {
    return <Redirect to="/" />;
  }

  const addressType = (params.get('addressType') ?? 'C') as AddressType;
  const address = stripAddressPrefix(active[`address${addressType}`] ?? '');

  return (
    <Page
      title={t('Receive crypto')}
      withBackButton
      contentProps={{ justifyContent: 'flex-start' }}
      description={t(
        'To receive funds you can choose to share your unique QR code or address below with the sender.',
      )}
      descriptionProps={{ maxWidth: '100%' }}
    >
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
          sx={{
            svg: {
              display: 'block',
            },
          }}
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
      <AddressCopyBox
        address={address}
        addressType={addressType}
        textProps={{ color: 'text.secondary' }}
      />
    </Page>
  );
};
