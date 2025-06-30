import { Box, Button, Collapse, Stack, styled } from '@avalabs/k2-alpine';
import { useAccountsContext } from '@core/ui';
import QRCodeSVG from 'qrcode.react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router-dom';
import { AddressItem } from '../AddressItem';
import CurrentAccount from '../CurrentAccount';
import * as Styled from '../Styled';
import { AddressSelector } from './components/AddressSelector';
import { CChainDisclaimer } from './components/CChainDisclaimer';
import { getLabelAndIcon, getSearchParams } from './utils';

const QRCodeBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(1.25),
  borderRadius: theme.shape.mediumBorderRadius,
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.surface.primary
      : theme.palette.background.paper,
}));

export const QRCode: FC = () => {
  const { t } = useTranslation();
  const { location, goBack } = useHistory();
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
    <Box height={1} gap={2} display="grid" gridTemplateRows="auto 1fr auto">
      <CurrentAccount />

      <Stack gap={1.5} alignItems="center" my="auto">
        <AddressSelector type={addressType} account={account} />
        <QRCodeBox>
          <QRCodeSVG
            renderAs="svg"
            value={account[`address${addressType}`] ?? ''}
            level="H"
            size={180}
          />
        </QRCodeBox>

        <Collapse in={addressType === 'C'}>
          <CChainDisclaimer />
        </Collapse>
      </Stack>

      <Stack mt="auto" gap={1.5}>
        <Styled.Card>
          <AddressItem
            {...getLabelAndIcon(addressType)}
            address={account[`address${addressType}`]}
            truncate={false}
            copyActionVisibility="always"
          />
        </Styled.Card>

        <Button
          variant="contained"
          size="small"
          color="secondary"
          onClick={goBack}
        >
          {t('Dismiss')}
        </Button>
      </Stack>
    </Box>
  );
};
