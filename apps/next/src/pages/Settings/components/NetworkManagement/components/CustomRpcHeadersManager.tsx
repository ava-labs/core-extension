import { useTranslation } from 'react-i18next';
import { Button, Stack } from '@avalabs/k2-alpine';

import { useIsIntersecting } from '@/components/Page/hooks/useIsIntersecting';
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
} from '../utils/customRpcHeaders';

type CustomRpcHeadersManagerProps = {
  setTab: (tab: 'add' | 'rpc-headers') => void;
  setNetwork: (network: Network) => void;
  network: Network;
};

export const CustomRpcHeadersManager = ({
  setTab,
  setNetwork,
  network,
}: CustomRpcHeadersManagerProps) => {
  const { capture } = useAnalyticsContext();
  const { t } = useTranslation();
  const { isIntersecting, isObserving } = useIsIntersecting();

  const rpcHeaders = useMemo(() => {
    console.log('network', network);
    return network?.customRpcHeaders ?? {};
  }, [network]);

  const [headerList, setHeaderList] = useState<KeyValueHeader[]>(
    getKeyValueHeaderList(rpcHeaders),
  );

  const isValid = isReadyToStore(headerList);

  const handleBack = () => {
    setTab('add');
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
      }}
    >
      <PageTopBar
        showBack
        onBackClicked={handleBack}
        isObserving={isObserving}
        isIntersecting={isIntersecting}
        title={t('Define custom RPC headers')}
      />

      <Stack>
        {headerList.map((listItem, index) => (
          <KeyValueFormField
            key={`existing-${index}`}
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
          />
        ))}
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mt: 'auto' }}>
        <Button disabled={!isValid} onClick={save}>
          {t('Save')}
        </Button>
        <Button onClick={handleCancel}>{t('Cancel')}</Button>
      </Stack>
    </Stack>
  );
};
