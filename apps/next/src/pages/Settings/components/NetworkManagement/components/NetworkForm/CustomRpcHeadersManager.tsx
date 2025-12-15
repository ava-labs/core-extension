import { useTranslation } from 'react-i18next';
import { Button, getHexAlpha, Stack, useTheme } from '@avalabs/k2-alpine';
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
  onSave?: (network: Network) => Promise<void>;
};

export const CustomRpcHeadersManager = ({
  setView,
  setNetwork,
  network,
  onSave,
}: CustomRpcHeadersManagerProps) => {
  const { capture } = useAnalyticsContext();
  const { t } = useTranslation();
  const theme = useTheme();
  const rpcHeaders = useMemo(() => {
    return network?.customRpcHeaders ?? {};
  }, [network]);

  const initialHeaderList = useMemo(
    () => getKeyValueHeaderList(rpcHeaders),
    [rpcHeaders],
  );

  const [headerList, setHeaderList] =
    useState<KeyValueHeader[]>(initialHeaderList);

  const isValid = isReadyToStore(headerList);

  // Check if there are changes compared to initial state
  const hasChanges = useMemo(() => {
    return (
      JSON.stringify(prepToStoreCustomRpcHeaders(headerList)) !==
      JSON.stringify(prepToStoreCustomRpcHeaders(initialHeaderList))
    );
  }, [headerList, initialHeaderList]);

  const handleBack = () => {
    setView('details');
  };

  const handleCancel = () => {
    setHeaderList(initialHeaderList);
  };

  const handleSave = async () => {
    if (!network) return;
    const headersToStore = prepToStoreCustomRpcHeaders(headerList);

    const updatedNetwork = {
      ...network,
      customRpcHeaders: headersToStore,
    };

    setNetwork(updatedNetwork);
    capture('CustomNetworkEdited');

    // Editing a network: custom RPC header changes are saved here.
    // Creating a new network: custom headers are saved in the previous step.
    if (onSave) {
      await onSave(updatedNetwork);
    }

    handleBack();
  };

  return (
    <Page
      contentProps={{ px: 0 }}
      containerProps={{ pb: 0 }}
      onBack={handleBack}
      title={t('Define custom RPC headers')}
    >
      <Stack rowGap={1} sx={{ flex: 1, px: 1.5, width: '100%' }}>
        {headerList.map((listItem, index) => (
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
              readonly={false}
            />
          </Card>
        ))}
      </Stack>
      {hasChanges && (
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
            onClick={handleSave}
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
