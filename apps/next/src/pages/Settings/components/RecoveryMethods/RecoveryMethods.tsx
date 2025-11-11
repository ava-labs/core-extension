import { Page } from '@/components/Page';
import { Button, Paper, Skeleton } from '@avalabs/k2-alpine';
import { RecoveryMethod as RecoveryMethodType } from '@core/types';
import { useAnalyticsContext, useSeedlessMfaManager } from '@core/ui';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RecoveryMethodList } from './RecoveryMethodList';
import { RecoveryMethod } from './RecoveryMethod';
import { ConfiguredMethodList } from './ConfiguredMethodList';
import { useHistory } from 'react-router-dom';

export enum RecoveryMethodScreen {
  ConfiguredList = 'configured-list',
  NewList = 'new-list',
  Method = 'method',
}

export const RecoveryMethods: FC = () => {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const history = useHistory();
  const [selectedMethod, setSelectedMethod] =
    useState<RecoveryMethodType | null>(null);
  const {
    isLoadingRecoveryMethods,
    recoveryMethods: existingRecoveryMethods,
    hasMfaConfigured,
    hasTotpConfigured,
  } = useSeedlessMfaManager();

  const [screen, setScreen] = useState<RecoveryMethodScreen>();

  useEffect(() => {
    if (isLoadingRecoveryMethods) {
      return;
    }
    setScreen(
      hasMfaConfigured
        ? RecoveryMethodScreen.ConfiguredList
        : RecoveryMethodScreen.NewList,
    );
  }, [hasMfaConfigured, isLoadingRecoveryMethods]);

  return (
    <Page
      title={t('Recovery methods')}
      withBackButton
      contentProps={{ justifyContent: 'flex-start' }}
      onBack={() => {
        if (screen !== RecoveryMethodScreen.Method) {
          history.push('/settings');
          return;
        }
        if (hasMfaConfigured) {
          setScreen(RecoveryMethodScreen.ConfiguredList);
          return;
        }
        setScreen(RecoveryMethodScreen.NewList);
      }}
    >
      {isLoadingRecoveryMethods && (
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            width: '100%',
          }}
        >
          <Skeleton variant="rectangular" sx={{ width: 297, height: 220 }} />
        </Paper>
      )}

      {!isLoadingRecoveryMethods && screen === RecoveryMethodScreen.NewList && (
        <RecoveryMethodList
          hasTotpConfigured={hasTotpConfigured}
          hasMFAConfigured={hasMfaConfigured}
          onNext={() => {
            capture('AddRecoveryMethodClicked');
            setScreen(RecoveryMethodScreen.NewList);
          }}
        />
      )}

      {!isLoadingRecoveryMethods &&
        screen === RecoveryMethodScreen.ConfiguredList && (
          <ConfiguredMethodList
            existingRecoveryMethods={existingRecoveryMethods}
            setSelectedMethod={setSelectedMethod}
            setScreen={setScreen}
          />
        )}

      {!isLoadingRecoveryMethods &&
        screen === RecoveryMethodScreen.Method &&
        selectedMethod && <RecoveryMethod method={selectedMethod} />}
      {screen === RecoveryMethodScreen.ConfiguredList && (
        <Button
          variant="contained"
          color="primary"
          size="extension"
          fullWidth
          sx={{ mt: 'auto' }}
          onClick={() => {
            capture('AddRecoveryMethodClicked');
            setScreen(RecoveryMethodScreen.NewList);
          }}
        >
          {t('Add recovery method')}
        </Button>
      )}
    </Page>
  );
};
