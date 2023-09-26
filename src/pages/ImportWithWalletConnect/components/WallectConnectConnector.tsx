import { useEffect, useState } from 'react';
import {
  Button,
  Scrollbars,
  Skeleton,
  Stack,
  Tab,
  TabPanel,
  Tabs,
  Typography,
} from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';
import { useWalletConnectContext } from '@src/contexts/WalletConnectContextProvider/WalletConnectContextProvider';
import { WalletConnectQRCode } from './WalletConnectQRCode';
import { WalletConnectStatusMessage } from './WalletConnectStatusMessage';
import { WalletConnectURIField } from './WalletConnectURIField';
import { AccountImportStatus } from '@src/contexts/WalletConnectContextProvider/models';

enum WalletConnectTabs {
  QR,
  URI,
}

interface WalletConnectConnectorProps {
  reconnectionAddress?: string;
  customMessage?: string;
  onConnect: () => void;
}

export default function WalletConnectConnector({
  reconnectionAddress,
  customMessage,
  onConnect,
}: WalletConnectConnectorProps) {
  const { t } = useTranslation();
  const [tab, setTab] = useState(WalletConnectTabs.QR);
  const { importState, reset, initiateImport } = useWalletConnectContext();
  const hasConnectionUri = 'uri' in importState;
  const showRegenerateButton =
    importState.status === AccountImportStatus.Failed;

  // Reset import state on mount
  useEffect(reset, [reset]);

  // Initiate account import as soon as this page is displayed,
  // as long as it wasn't already initiated.
  useEffect(() => {
    if (importState.status === AccountImportStatus.NotInitiated) {
      initiateImport(reconnectionAddress);
    }
  }, [initiateImport, reconnectionAddress, importState.status]);

  useEffect(() => {
    if (importState.status === AccountImportStatus.Successful) {
      onConnect();
    }
  }, [importState, onConnect]);

  return (
    <Stack
      sx={{
        gap: 2.5,
        px: 2,
        height: '100%',
        width: '100%',
        alignItems: 'center',
      }}
    >
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
              <Stack
                sx={{
                  gap: 1.5,
                  width: '200px',
                  marginX: 'auto',
                }}
              >
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
          {showRegenerateButton && (
            <Button
              sx={{ mb: 4 }}
              onClick={() => initiateImport(reconnectionAddress)}
            >
              {t('Regenerate QR code')}
            </Button>
          )}
          {!showRegenerateButton && tab === WalletConnectTabs.QR && (
            <Typography variant="body2" sx={{ mb: 4, width: '280px' }}>
              {customMessage ?? t('Scan the QR code with your mobile wallet.')}
            </Typography>
          )}
        </>
      )}

      {!hasConnectionUri && (
        <Stack sx={{ pt: 5.5 }}>
          <Skeleton variant="rectangular" width="200px" height="200px" />
        </Stack>
      )}
    </Stack>
  );
}
