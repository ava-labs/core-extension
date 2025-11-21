import { Box, Collapse, Stack, styled } from '@avalabs/k2-alpine';
import { useAccountsContext } from '@core/ui';
import QRCodeSVG from 'qrcode.react';
import { FC } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { Page } from '@/components/Page';
import { AddressItem } from '@/components/Address/AddressItem';
import { type History } from 'history';
import * as Styled from '../Styled';
import { AddressSelector } from '../../../../components/AddressSelector';
import { getNavigateToQRCode, getSearchParams } from './utils';
import { AddressType } from '@core/types';
import { getChainLabelAndIconByAddressType } from '@/utils/getChainLabelAndIconByAddressType';
import { CChainAddressDisclaimer } from '@/components/CChainAddressDisclaimer';
import CurrentAccount from '../CurrentAccount';

const QRCodeBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(1.25),
  borderRadius: theme.shape.mediumBorderRadius,
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.surface.primary
      : theme.palette.background.paper,
}));

const getOnAddressChange = (replace: History['replace'], accountId: string) => {
  const getNavigate = getNavigateToQRCode(replace, accountId);
  return (type: AddressType) => {
    getNavigate(type)();
  };
};

export const QRCode: FC = () => {
  const { location, replace } = useHistory();
  const { accountId, addressType = 'C' } = getSearchParams(location.search);

  const { getAccountById } = useAccountsContext();

  if (!accountId) {
    return <Redirect to="/account-management" />;
  }

  const account = getAccountById(accountId!);

  if (!account) {
    return <Redirect to="/account-management" />;
  }

  return (
    <Page
      withBackButton
      contentProps={{ alignItems: 'stretch', justifyContent: 'flex-start' }}
    >
      <CurrentAccount />
      <Box height={1} gap={2} display="grid" gridTemplateRows="1fr auto">
        <Stack gap={1.5} alignItems="center" my="auto">
          <AddressSelector
            type={addressType}
            account={account}
            onChange={getOnAddressChange(replace, account.id)}
          />
          <QRCodeBox>
            <QRCodeSVG
              renderAs="svg"
              value={account[`address${addressType}`] ?? ''}
              level="H"
              size={180}
            />
          </QRCodeBox>

          <Collapse in={addressType === 'C'}>
            <CChainAddressDisclaimer />
          </Collapse>
        </Stack>

        <Stack mt="auto" gap={1.5}>
          <Styled.Card>
            <AddressItem
              {...getChainLabelAndIconByAddressType(addressType)}
              address={account[`address${addressType}`]}
              truncate={false}
              copyActionVisibility="always"
            />
          </Styled.Card>
        </Stack>
      </Box>
    </Page>
  );
};
