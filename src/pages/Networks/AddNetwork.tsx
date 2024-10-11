import { useEffect, useRef, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Scrollbars,
  ScrollbarsRef,
  Stack,
  Tooltip,
  Typography,
  styled,
  toast,
  useTheme,
} from '@avalabs/core-k2-components';
import { Network, NetworkVMType } from '@avalabs/core-chains-sdk';

import { PageTitle } from '@src/components/common/PageTitle';
import { usePageHistory } from '@src/hooks/usePageHistory';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

import { NetworkForm, NetworkFormAction } from './NetworkForm';
import { NetworkTab } from './Networks';

const FlexScrollbars = styled(Scrollbars)`
  flex-grow: 1;
  max-height: unset;
  height: 100%;
  width: 100%;

  & > div {
    display: flex;
    flex-direction: column;
  }
`;

export const AddNetwork = () => {
  const { t } = useTranslation();
  const { saveCustomNetwork, isDeveloperMode } = useNetworkContext();
  const { getPageHistoryData, setNavigationHistoryData } = usePageHistory();

  const history = useHistory();
  const theme = useTheme();
  const defaultNetworkValues = useMemo(
    () => ({
      chainName: '',
      chainId: 0,
      vmName: NetworkVMType.EVM,
      rpcUrl: '',
      networkToken: {
        name: '',
        symbol: '',
        description: '',
        decimals: 18,
        logoUri: '',
      },
      logoUri: '',
      explorerUrl: '',
    }),
    []
  );
  const [network, setNetwork] = useState<Network>(defaultNetworkValues);

  const pageHistoryData = useMemo(
    () => ({
      ...getPageHistoryData(),
    }),
    [getPageHistoryData]
  );

  useEffect(() => {
    if (Object.keys(pageHistoryData).length) {
      setShowErrors(true);
    }
    setNetwork({ ...defaultNetworkValues, ...pageHistoryData });
  }, [defaultNetworkValues, pageHistoryData]);

  const [isFormValid, setIsFormValid] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const scrollbarRef = useRef<ScrollbarsRef | null>(null);
  const { capture } = useAnalyticsContext();
  const [isSaving, setIsSaving] = useState(false);

  const onSuccess = () => {
    capture('CustomNetworkAdded');
    toast.success(t('Custom network added!'), { duration: 2000 });
    history.push(`/networks?activeTab=${NetworkTab.Custom}`);
  };

  const onError = (e: string) => {
    setErrorMessage(e);
    scrollbarRef?.current?.scrollToTop();
  };

  const handleSave = () => {
    setIsSaving(true);

    saveCustomNetwork(network)
      .then(onSuccess)
      .catch(onError)
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleChange = (networkState: Network, formValid: boolean) => {
    setNetwork({
      ...networkState,
      isTestnet: isDeveloperMode,
    });
    setNavigationHistoryData({ ...networkState });
    setIsFormValid(formValid);
  };

  return (
    <Stack sx={{ width: 1 }}>
      <PageTitle>{t('Add Network')}</PageTitle>
      <FlexScrollbars ref={scrollbarRef}>
        <Stack sx={{ gap: 1, px: 2 }}>
          {errorMessage && (
            <Typography
              variant="body2"
              color={theme.palette.error.main}
              sx={{ py: 1, mb: 2 }}
            >
              {errorMessage}
            </Typography>
          )}
          <NetworkForm
            customNetwork={network}
            handleChange={handleChange}
            showErrors={showErrors}
            action={NetworkFormAction.Add}
          />
        </Stack>
      </FlexScrollbars>
      <Stack
        direction="row"
        sx={{
          flexGrow: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
          py: 3,
          gap: 1,
          px: 2,
        }}
      >
        <Button
          color="secondary"
          data-testid="cancel-network-save"
          size="large"
          fullWidth
          onClick={history.goBack}
          sx={{ px: 0 }}
        >
          {t('Cancel')}
        </Button>
        <Tooltip
          title={!isFormValid && t('There are invalid fields in the form')}
          sx={{ boxSizing: 'border-box', width: '100%' }}
        >
          <Button
            color="primary"
            data-testid="add-network-save"
            size="large"
            fullWidth
            disabled={!isFormValid || isSaving}
            isLoading={isSaving}
            onClick={() => {
              setShowErrors(true);
              if (isFormValid) {
                handleSave();
              }
            }}
            sx={{ px: 0 }}
          >
            {t('Save')}
          </Button>
        </Tooltip>
      </Stack>
    </Stack>
  );
};
