import { Page } from '@/components/Page';
import { useTranslation } from 'react-i18next';
import { Button, Stack } from '@avalabs/k2-alpine';
import { NetworkForm } from './NetworkForm/NetworkForm';
import { useAddNetwork } from '../hooks/useAddNetwork';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CustomRpcHeadersManager } from './CustomRpcHeadersManager';
import { useNetworkContext } from '@core/ui';

type tabs = 'add' | 'rpc-headers';

export const AddNetwork = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { saveCustomNetwork } = useNetworkContext();
  const { network, isValid, setNetwork, reset } = useAddNetwork();
  const [ranReset, setRanReset] = useState<boolean>(false);

  const [tab, setTab] = useState<tabs>('add');

  useEffect(() => {
    if (!ranReset) {
      console.log('resetting');
      reset();
      setRanReset(true);
    }
  }, [reset, ranReset, history.location.search]);

  const submit = () => {
    console.log('submitting');
    saveCustomNetwork(network);
  };

  return (
    <>
      {tab === 'add' && (
        <Page
          withBackButton
          contentProps={{
            gap: 2,
            sx: {
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            },
          }}
        >
          <NetworkForm
            network={network}
            setNetwork={setNetwork}
            setTab={setTab}
          />

          <Stack direction="row" spacing={2} sx={{ mt: 'auto' }}>
            <Button disabled={!isValid} onClick={submit}>
              {t('Save')}
            </Button>
            <Button>{t('Cancel')}</Button>
          </Stack>
        </Page>
      )}
      {tab === 'rpc-headers' && (
        <CustomRpcHeadersManager
          setTab={setTab}
          setNetwork={setNetwork}
          network={network}
        />
      )}
    </>
  );
};
