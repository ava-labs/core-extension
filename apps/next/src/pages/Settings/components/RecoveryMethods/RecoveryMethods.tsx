import { Page } from '@/components/Page';
import { Button, Paper, Skeleton } from '@avalabs/k2-alpine';
import { RecoveryMethod as RecoveryMethodType } from '@core/types';
import { useAnalyticsContext, useSeedlessMfaManager } from '@core/ui';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteMatch } from 'react-router-dom';
import { RecoveryMethodList } from './RecoveryMethodList';
import { RecoveryMethodCard } from './RecoveryMethodCard';
import { RecoveryMethod } from './RecoveryMethod';

export const RecoveryMethods: FC = () => {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const { path } = useRouteMatch();
  console.log('path: ', path);
  const [selectedMethod, setSelectedMethod] =
    useState<RecoveryMethodType | null>(null);
  const {
    isLoadingRecoveryMethods,
    recoveryMethods,
    // hasFidoConfigured,
    hasMfaConfigured,
    // hasTotpConfigured,
  } = useSeedlessMfaManager();

  console.log('selectedMethod: ', selectedMethod);
  if (selectedMethod) {
    return <RecoveryMethod method={selectedMethod} />;
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
          <RecoveryMethodList />
        ) : (
          recoveryMethods.map((method) => {
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
      >
        {t('Add recovery method')}
      </Button>
    </Page>
  );
};
