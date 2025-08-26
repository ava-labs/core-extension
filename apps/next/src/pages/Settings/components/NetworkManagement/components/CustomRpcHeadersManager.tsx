import { useTranslation } from 'react-i18next';
import { Button, Stack } from '@avalabs/k2-alpine';
import { useAddNetwork } from '../hooks/useAddNetwork';
import { useHistory } from 'react-router-dom';
import { useIsIntersecting } from '@/components/Page/hooks/useIsIntersecting';
import { PageTopBar } from '@/components/PageTopBar';
import {
  CustomRpcHeaders,
  Network,
  PLACEHOLDER_RPC_HEADERS,
} from '@core/types';
import { useMemo, useState } from 'react';
import { useNetworkContext } from '@core/ui';
import { KeyValueFormField } from '@/components/Forms/KeyValueFormField';

export const CustomRpcHeadersManager = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const isAddNetworkFlow = history.location.pathname.includes('add');
  const { network: newNetwork } = useAddNetwork();
  const { networks } = useNetworkContext();
  const { isIntersecting, isObserving } = useIsIntersecting();
  const network: Network | undefined = isAddNetworkFlow
    ? newNetwork
    : networks[0]; // TODO fix network selection

  const rpcHeaders = useMemo(() => {
    return network?.customRpcHeaders ?? {};
  }, [network]);

  const [newRpcHeaders, setNewRpcHeaders] = useState<CustomRpcHeaders>(
    PLACEHOLDER_RPC_HEADERS,
  );

  const setNewHeaders = (newHeader: CustomRpcHeaders) => {
    setNewRpcHeaders({
      ...newRpcHeaders,
      ...newHeader,
      ...PLACEHOLDER_RPC_HEADERS,
    });
  };

  const { isValid } = useAddNetwork();

  const handleBack = () => {
    history.push('/settings/network-management/add', {
      fromCustomRpcHeaders: true,
    });
  };

  const handleCancel = () => {
    handleBack();
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
        {Object.entries(rpcHeaders).map(([key, value]) => (
          <KeyValueFormField
            key={key}
            label={t('Enter header name')}
            placeholder={t('Enter header name')}
            prompt={t('Enter header name')}
            value={{
              key,
              value,
            }}
            onChange={(newKeyValue) =>
              setNewHeaders({
                [newKeyValue.key]: newKeyValue.value,
              })
            }
          />
        ))}
        {Object.entries(newRpcHeaders).map(([key, value]) => (
          <KeyValueFormField
            key={key}
            label={t('Enter header name')}
            placeholder={t('Enter header name')}
            prompt={t('Enter header name')}
            value={{
              key,
              value,
            }}
            onChange={(newKeyValue) =>
              setNewHeaders({
                [newKeyValue.key]: newKeyValue.value,
              })
            }
          />
        ))}
      </Stack>
      <Stack direction="row" spacing={2} sx={{ mt: 'auto' }}>
        <Button disabled={!isValid}>{t('Save')}</Button>
        <Button onClick={handleCancel}>{t('Cancel')}</Button>
      </Stack>
    </Stack>
  );
};
