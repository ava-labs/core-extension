import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  CircularProgress,
  Scrollbars,
  Stack,
  Tab,
  TabPanel,
  Tabs,
  Typography,
  useTheme,
} from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';

import { PageTitle } from '@src/components/common/PageTitle';
import { useWalletConnectContext } from '@src/contexts/WalletConnectContextProvider/WalletConnectContextProvider';
import { AccountImportStatus } from '@src/contexts/WalletConnectContextProvider/models';

import { WalletConnectCircledIcon } from './components/WalletConnectCircledIcon';
import { WalletConnectQRCode } from './components/WalletConnectQRCode';
import { WalletConnectURIField } from './components/WalletConnectURIField';
import { WalletConnectStatusMessage } from './components/WalletConnectStatusMessage';

enum WalletConnectTabs {
  QR,
  URI,
}

export default function ImportWithWalletConnect() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { goBack } = useHistory();
  const [tab, setTab] = useState(WalletConnectTabs.QR);
  const { importState, initiateImport, mockFailure, mockSuccess } =
    useWalletConnectContext();
  const hasConnectionUri = 'uri' in importState;

  // Initiate account import as soon as this page is displayed
  useEffect(initiateImport, [initiateImport]);

  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
        background: theme.palette.background.paper,
      }}
    >
      <PageTitle margin="20px 0 4px" onBackClick={goBack}>
        {t('Connect your Wallet')}
      </PageTitle>
      <Stack
        sx={{
          gap: 2.5,
          px: 5,
          mt: 3,
          height: '100%',
          alignItems: 'center',
        }}
      >
        <WalletConnectCircledIcon />
        {hasConnectionUri && (
          <>
            <Tabs
              size="medium"
              value={tab}
              onChange={(_, chosenTab) => setTab(chosenTab)}
              isContained
            >
              <Tab
                label={t('QR Code')}
                value={WalletConnectTabs.QR}
                data-testid="wc-tab-qr"
                sx={{ mr: 0.5 }}
              />
              <Tab
                label={t('URI')}
                value={WalletConnectTabs.URI}
                data-testid="wc-tab-uri"
              />
            </Tabs>
            <Scrollbars
              style={{
                flexGrow: 1,
                maxHeight: 'unset',
                height: '100%',
                justifyContent: 'center',
              }}
            >
              <TabPanel
                value={tab}
                index={WalletConnectTabs.QR}
                sx={{ textAlign: 'center' }}
              >
                <Stack sx={{ gap: 1.5, width: 200, marginX: 'auto' }}>
                  <WalletConnectQRCode
                    uri={importState.uri}
                    status={importState.status}
                  />
                  <WalletConnectStatusMessage importState={importState} />
                </Stack>
              </TabPanel>
              <TabPanel value={tab} index={WalletConnectTabs.URI}>
                <Stack sx={{ gap: 1.5, width: 220, marginX: 'auto' }}>
                  <WalletConnectURIField
                    uri={importState.uri}
                    status={importState.status}
                  />
                  <WalletConnectStatusMessage importState={importState} />
                </Stack>
              </TabPanel>
            </Scrollbars>
          </>
        )}

        <Typography variant="body2">
          {t('Scan the QR code with your mobile wallet.')}
        </Typography>

        {importState.status === AccountImportStatus.Initiated && (
          <CircularProgress size={120} />
        )}

        {/* TODO: remove when we have the backend integration */}
        <Stack direction="row" sx={{ opacity: 0.2 }}>
          <Button variant="text" size="small" onClick={mockSuccess}>
            Fake Success
          </Button>
          <Button variant="text" size="small" onClick={mockFailure}>
            Fake Failure
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
