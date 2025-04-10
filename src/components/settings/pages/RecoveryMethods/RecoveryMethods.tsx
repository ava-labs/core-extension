import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Button, PlusIcon, Skeleton } from '@avalabs/core-k2-components';
import browser from 'webextension-polyfill';

import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useSeedlessMfaManager } from '@src/contexts/SeedlessMfaManagementProvider';
import {
  RecoveryMethodFido,
  RecoveryMethodType,
} from 'packages/service-worker/src/services/seedless/models';
import { KeyType } from '@src/utils/seedless/fido/types';
import { ContextContainer } from '@src/hooks/useIsSpecificContextContainer';

import { SettingsHeader } from '../../SettingsHeader';
import { SettingsPageProps } from '../../models';

import { RecoveryMethod } from '../../../common/seedless/components/RecoveryMethod';
import { RecoveryMethodsList } from './RecoveryMethodsList';
import { AddNewRecoveryMethod } from './AddNewRecoveryMethod';
import { AuthenticatorDetails } from './AuthenticatorDetails';
import { FIDODetails } from './FIDODetails';

enum RecoveryMethodScreen {
  List = 'list',
  AddNew = 'add-new',
  Authenticator = 'authenticator',
  FidoDetails = 'fido-details',
}

export function RecoveryMethods({
  goBack,
  navigateTo,
  width,
}: SettingsPageProps) {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const {
    isLoadingRecoveryMethods,
    recoveryMethods,
    hasFidoConfigured,
    hasMfaConfigured,
    hasTotpConfigured,
  } = useSeedlessMfaManager();

  const [fidoDetails, setFidoDetails] = useState<RecoveryMethodFido>();

  const [screen, setScreen] = useState(RecoveryMethodScreen.List);

  const startRecoveryMethodSetup = useCallback(async (type?: KeyType) => {
    const url = type
      ? `update-recovery-methods?keyType=${type}`
      : 'update-recovery-methods';

    // Open in a full screen tab to avoid popup hell
    browser.tabs.create({ url: `${ContextContainer.FULLSCREEN}#/${url}` });
  }, []);

  const onMethodClick = useCallback(
    async (method: RecoveryMethodType) => {
      if (method === RecoveryMethodType.Authenticator && !hasFidoConfigured) {
        // If user is trying to configure TOTP and does not have FIDO configured,
        // we can show everything inside the regular extension window.
        setScreen(RecoveryMethodScreen.Authenticator);
      } else {
        // Otherwise, we need to open a fullscreen flow (FIDO verification happens within a popup,
        // which would make the regular extension window close).

        if (method === RecoveryMethodType.Authenticator) {
          await startRecoveryMethodSetup();
        } else if (method === RecoveryMethodType.Passkey) {
          await startRecoveryMethodSetup(KeyType.Passkey);
        } else {
          await startRecoveryMethodSetup(KeyType.Yubikey);
        }
      }
    },
    [startRecoveryMethodSetup, hasFidoConfigured],
  );

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
            autoInitialize={!hasTotpConfigured}
          />
        )}
        {screen === RecoveryMethodScreen.FidoDetails && fidoDetails && (
          <FIDODetails
            details={fidoDetails}
            onBackClick={() => {
              setScreen(RecoveryMethodScreen.List);
              setFidoDetails(undefined);
            }}
          />
        )}
        {screen === RecoveryMethodScreen.AddNew && (
          <AddNewRecoveryMethod
            onBackClick={() => setScreen(RecoveryMethodScreen.List)}
            onMethodClick={onMethodClick}
            excludeTotp={hasTotpConfigured}
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
                        />
                      );
                    }

                    return (
                      <RecoveryMethod
                        key={method.id}
                        methodName={method.name}
                        onClick={() => {
                          capture('ConfigureFidoClicked');
                          setFidoDetails(method);
                          setScreen(RecoveryMethodScreen.FidoDetails);
                        }}
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
