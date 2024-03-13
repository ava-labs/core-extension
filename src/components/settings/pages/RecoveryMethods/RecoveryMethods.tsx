import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Button, PlusIcon, Skeleton } from '@avalabs/k2-components';

import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useSeedlessMfaManager } from '@src/contexts/SeedlessMfaManagementProvider';
import { RecoveryMethodType } from '@src/background/services/seedless/models';

import { SettingsHeader } from '../../SettingsHeader';
import { SettingsPageProps } from '../../models';

import { AuthenticatorDetails } from './AuthenticatorDetails';
import { RecoveryMethod } from './RecoveryMethod';
import { RecoveryMethodsList } from './RecoveryMethodsList';
import { AddNewRecoveryMethod } from './AddNewRecoveryMethod';

enum RecoveryMethodScreen {
  List = 'list',
  AddNew = 'add-new',
  Authenticator = 'authenticator',
}

export function RecoveryMethods({
  goBack,
  navigateTo,
  width,
}: SettingsPageProps) {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const { isLoadingRecoveryMethods, recoveryMethods } = useSeedlessMfaManager();

  const hasMfaConfigured = recoveryMethods.length > 0;

  const [screen, setScreen] = useState(RecoveryMethodScreen.List);

  const onMethodClick = useCallback(async (method: RecoveryMethodType) => {
    if (method === RecoveryMethodType.Authenticator) {
      setScreen(RecoveryMethodScreen.Authenticator);
    }
  }, []);

  return (
    <Stack
      sx={{
        width: 1,
        height: 1,
      }}
    >
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={t('Recovery Methods')}
      />
      <Stack sx={{ width: 1, mt: 2, gap: 2, flexGrow: 1 }}>
        {screen === RecoveryMethodScreen.Authenticator && (
          <AuthenticatorDetails
            onBackClick={() => setScreen(RecoveryMethodScreen.List)}
          />
        )}
        {screen === RecoveryMethodScreen.AddNew && (
          <AddNewRecoveryMethod
            onBackClick={() => setScreen(RecoveryMethodScreen.List)}
            onMethodClick={onMethodClick}
          />
        )}
        {screen === RecoveryMethodScreen.List && (
          <>
            {isLoadingRecoveryMethods && (
              <>
                <Skeleton variant="rectangular" sx={{ width: 1, height: 40 }} />
                <Skeleton variant="rectangular" sx={{ width: 1, height: 40 }} />
                <Skeleton variant="rectangular" sx={{ width: 1, height: 40 }} />
              </>
            )}
            {!isLoadingRecoveryMethods && (
              <>
                {hasMfaConfigured ? (
                  recoveryMethods.map((method) => {
                    if (method.type === 'totp') {
                      return (
                        <RecoveryMethod
                          key="totp"
                          methodName={t('Authenticator')}
                          onClick={() => {
                            capture('ConfigureTotpClicked');
                            setScreen(RecoveryMethodScreen.Authenticator);
                          }}
                          sx={{ alignItems: 'center' }}
                        />
                      );
                    }

                    return (
                      <RecoveryMethod
                        key={method.id}
                        methodName={method.name}
                        onClick={() => {
                          capture('ConfigureFidoClicked');
                          // TODO: navigation
                        }}
                        sx={{ alignItems: 'center' }}
                      />
                    );
                  })
                ) : (
                  <RecoveryMethodsList onMethodClick={onMethodClick} />
                )}
              </>
            )}
          </>
        )}
      </Stack>
      {hasMfaConfigured && (
        <Stack
          sx={{
            width: 1,
            px: 2,
            py: 3,
            borderTop: '1px solid',
            borderTopColor: 'divider',
          }}
        >
          <Button
            color="secondary"
            startIcon={<PlusIcon />}
            size="large"
            onClick={() => setScreen(RecoveryMethodScreen.AddNew)}
          >
            {t('Add Recovery Method')}
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
