import { Trans, useTranslation } from 'react-i18next';
import { Button, Stack, Typography } from '@avalabs/k2-alpine';
import { PageTopBar } from '@/components/PageTopBar';
import { Network } from '@core/types';
import { useMemo, useState } from 'react';
import { useAnalyticsContext } from '@core/ui';
import { KeyValueFormField } from '@/components/Forms/KeyValueFormField';
import {
  getKeyValueHeaderList,
  isReadyToStore,
  KeyValueHeader,
  prepToStoreCustomRpcHeaders,
  updateKeyValueList,
} from './utils/customRpcHeaders';
import { EditNetworkFormTab } from './types';
import { Card } from '@/components/Card';

type CustomRpcHeadersManagerProps = {
  setTab: (tab: EditNetworkFormTab) => void;
  setNetwork: (network: Network) => void;
  network: Network;
  readonly: boolean;
};

export const CustomRpcHeadersManager = ({
  setTab,
  setNetwork,
  network,
  readonly,
}: CustomRpcHeadersManagerProps) => {
  const { capture } = useAnalyticsContext();
  const { t } = useTranslation();

  const rpcHeaders = useMemo(() => {
    return network?.customRpcHeaders ?? {};
  }, [network]);

  const [headerList, setHeaderList] = useState<KeyValueHeader[]>(
    getKeyValueHeaderList(rpcHeaders),
  );

  const isValid = isReadyToStore(headerList);

  const handleBack = () => {
    setTab('details');
  };

  const handleCancel = () => {
    handleBack();
  };

  const save = () => {
    if (!network) return;
    const headersToStore = prepToStoreCustomRpcHeaders(headerList);

    const updatedNetwork = {
      ...network,
      customRpcHeaders: headersToStore,
    };
    console.log('CustomRpcHeadersManager: Setting network with headers:', {
      originalNetwork: network,
      headersToStore,
      updatedNetwork,
    });
    setNetwork(updatedNetwork);
    capture('CustomNetworkEdited');
    return handleBack();
  };

  return (
    <Stack
      sx={{
        height: '100cqh',
        width: 1,
        bgcolor: 'background.backdrop',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        px: 1.5,
      }}
    >
      <PageTopBar showBack onBackClicked={handleBack} />
      <Typography variant="h2">
        <Trans i18nKey="Define custom<br />RPC headers" />
      </Typography>

      <Stack rowGap={1}>
        {readonly && headerList.length === 1 ? (
          <Stack width="100%" gap={1} sx={{ mt: 'auto' }}>
            <Typography variant="body1">
              {t('No custom headers are configured.')}
            </Typography>
          </Stack>
        ) : (
          headerList.map((listItem, index) => (
            <Card key={`keyValueFormField-${index}`} sx={{ px: 1 }}>
              <KeyValueFormField
                labels={{
                  key: t('Header name'),
                  value: t('Value'),
                }}
                placeholders={{
                  key: t('Enter header name'),
                  value: t('Enter a value'),
                }}
                prompt={t('Add next')}
                values={{
                  key: listItem.key,
                  value: listItem.value,
                }}
                onChange={(newKeyValue) =>
                  setHeaderList(
                    updateKeyValueList(
                      headerList,
                      {
                        key: newKeyValue.key,
                        value: newKeyValue.value,
                      },
                      index,
                    ),
                  )
                }
                readonly={readonly}
              />
            </Card>
          ))
        )}
      </Stack>
      {!readonly && (
        <Stack width="100%" gap={1} sx={{ mt: 'auto' }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            fullWidth
            disabled={!isValid}
            onClick={save}
          >
            {t('Save')}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            fullWidth
            onClick={handleCancel}
          >
            {t('Cancel')}
          </Button>
        </Stack>
      )}
    </Stack>
  );
};
