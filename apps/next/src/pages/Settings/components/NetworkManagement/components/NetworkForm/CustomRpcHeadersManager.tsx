import { useTranslation } from 'react-i18next';
import {
  Button,
  getHexAlpha,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
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
import { EditNetworkFormView } from './types';
import { Card } from '@/components/Card';
import { Page } from '@/components/Page';

type CustomRpcHeadersManagerProps = {
  setView: (view: EditNetworkFormView) => void;
  setNetwork: (network: Network) => void;
  network: Network;
  readonly: boolean;
};

export const CustomRpcHeadersManager = ({
  setView,
  setNetwork,
  network,
  readonly,
}: CustomRpcHeadersManagerProps) => {
  const { capture } = useAnalyticsContext();
  const { t } = useTranslation();
  const theme = useTheme();
  const rpcHeaders = useMemo(() => {
    return network?.customRpcHeaders ?? {};
  }, [network]);

  const [headerList, setHeaderList] = useState<KeyValueHeader[]>(
    getKeyValueHeaderList(rpcHeaders),
  );

  const isValid = isReadyToStore(headerList);

  const handleBack = () => {
    setView('details');
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

    setNetwork(updatedNetwork);
    capture('CustomNetworkEdited');
    return handleBack();
  };

  return (
    <Page
      contentProps={{ px: 0 }}
      containerProps={{ pb: 0 }}
      onBack={handleBack}
      title={t('Define custom RPC headers')}
    >
      <Stack rowGap={1} sx={{ flex: 1, px: 1.5, width: '100%' }}>
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
        <Stack
          width="100%"
          gap={1}
          position="sticky"
          bottom={12}
          pt={3}
          pb={2}
          sx={{
            background: `linear-gradient(180deg, ${getHexAlpha(theme.palette.alphaMatch.backdropSolid, 0)} 0%, ${theme.palette.alphaMatch.backdropSolid} 32.5%)`,
          }}
        >
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
    </Page>
  );
};
