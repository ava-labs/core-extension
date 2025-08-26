import { Page } from '@/components/Page';
import { useTranslation } from 'react-i18next';
import { Button, Stack } from '@avalabs/k2-alpine';
import { NetworkForm } from './NetworkForm/NetworkForm';
import { useAddNetwork } from '../hooks/useAddNetwork';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

export const AddNetwork = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const { network, isValid, setNetwork, reset } = useAddNetwork();
  const [ranReset, setRanReset] = useState<boolean>(false);

  useEffect(() => {
    // Only reset if we're not coming from CustomRpcHeaders
    const state = history.location.state as
      | { fromCustomRpcHeaders?: boolean; fromAddNetwork?: boolean }
      | undefined;
    const fromCustomRpcHeaders = state?.fromCustomRpcHeaders;
    if (!fromCustomRpcHeaders && !ranReset) {
      reset();
      setRanReset(true);
    }
  }, [reset, history.location.state, ranReset]);

  return (
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
      <NetworkForm network={network} setNetwork={setNetwork} />

      <Stack direction="row" spacing={2} sx={{ mt: 'auto' }}>
        <Button disabled={!isValid}>{t('Save')}</Button>
        <Button>{t('Cancel')}</Button>
      </Stack>
    </Page>
  );
};
