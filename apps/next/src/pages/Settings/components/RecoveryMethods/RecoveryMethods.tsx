import { Page } from '@/components/Page';
import { Button, Paper, Skeleton } from '@avalabs/k2-alpine';
import { RecoveryMethod as RecoveryMethodType } from '@core/types';
import { useAnalyticsContext, useSeedlessMfaManager } from '@core/ui';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RecoveryMethodList } from './RecoveryMethodList';
import { RecoveryMethodCard } from './RecoveryMethodCard';
import { RecoveryMethod } from './RecoveryMethod';
import { ConfiguredMethodList } from './ConfiguredMethodList';

export enum RecoveryMethodScreen {
  ConfiguredList = 'configured-list',
  NewList = 'new-list',
  Method = 'method',
  // AddNew = 'add-new',
  // Authenticator = 'authenticator',
  // FidoDetails = 'fido-details',
}

export const RecoveryMethods: FC = () => {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const [selectedMethod, setSelectedMethod] =
    useState<RecoveryMethodType | null>(null);
  console.log('selectedMethod: ', selectedMethod);
  const {
    isLoadingRecoveryMethods,
    recoveryMethods: existingRecoveryMethods,
    // hasFidoConfigured,
    hasMfaConfigured,
    hasTotpConfigured,
  } = useSeedlessMfaManager();

  const [screen, setScreen] = useState(RecoveryMethodScreen.ConfiguredList);

  return (
    <Page
      title={t('Recovery methods')}
      withBackButton
      contentProps={{ justifyContent: 'flex-start' }}
    >
      <Paper
        elevation={1}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {isLoadingRecoveryMethods && (
          <>
            <Skeleton variant="rectangular" sx={{ width: 297, height: 220 }} />
          </>
        )}

        {screen === RecoveryMethodScreen.NewList && (
          <RecoveryMethodList hasTotpConfigured={hasTotpConfigured} />
        )}

        {screen === RecoveryMethodScreen.ConfiguredList && (
          <ConfiguredMethodList
            existingRecoveryMethods={existingRecoveryMethods}
            setSelectedMethod={setSelectedMethod}
            setScreen={setScreen}
          />
        )}

        {screen === RecoveryMethodScreen.Method && selectedMethod && (
          <RecoveryMethod
            method={selectedMethod}
            onBackClicked={() => setSelectedMethod(null)}
          />
        )}
      </Paper>
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
  console.log('selectedMethod: ', selectedMethod);
  if (selectedMethod) {
    return (
      <RecoveryMethod
        method={selectedMethod}
        onBackClicked={() => setSelectedMethod(null)}
      />
    );
  }

  return (
    <Page
      title={t('Recovery methods')}
      withBackButton
      contentProps={{ justifyContent: 'flex-start' }}
    >
      <Paper
        elevation={1}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {isLoadingRecoveryMethods && (
          <>
            <Skeleton variant="rectangular" sx={{ width: 297, height: 220 }} />
          </>
        )}
        {!isLoadingRecoveryMethods && !hasMfaConfigured ? (
          <RecoveryMethodList hasTotpConfigured={hasTotpConfigured} />
        ) : (
          existingRecoveryMethods.map((method) => {
            if (method.type === 'totp') {
              return (
                <RecoveryMethodCard
                  method={method}
                  key="totp"
                  methodName={t('Authenticator')}
                  onClick={() => {
                    capture('ConfigureTotpClicked');
                    setSelectedMethod(method);
                  }}
                />
              );
            }

            return (
              <RecoveryMethodCard
                method={method}
                key={method.id}
                methodName={method.name}
                onClick={() => {
                  capture('ConfigureFidoClicked');
                  console.log('method clicked: ', method);
                  setSelectedMethod(method);
                }}
              />
            );
          })
        )}
      </Paper>
      <Button
        variant="contained"
        color="primary"
        size="extension"
        fullWidth
        sx={{ mt: 'auto' }}
        onClick={() => {
          capture('AddRecoveryMethodClicked');
        }}
      >
        {t('Add recovery method')}
      </Button>
    </Page>
  );
};
