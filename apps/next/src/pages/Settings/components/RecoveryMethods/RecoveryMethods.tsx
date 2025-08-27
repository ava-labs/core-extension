import { Page } from '@/components/Page';
import { CardMenu, CardMenuItem } from '@/pages/Onboarding/components/CardMenu';
import {
  Box,
  Button,
  ChevronRightIcon,
  Divider,
  EncryptedIcon,
  IconButton,
  Paper,
  PasswordIcon,
  SecurityKeyIcon,
  Skeleton,
  Typography,
} from '@avalabs/k2-alpine';
import { FeatureGates } from '@core/types';
import {
  useAnalyticsContext,
  useFeatureFlagContext,
  useSeedlessMfaManager,
} from '@core/ui';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlinePassword } from 'react-icons/md';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { RecoveryMethodList } from './RecoveryMethodList';
import { RecoveryMethodCard } from './RecoveryMethodCard';
import { RecoveryMethod } from './RecoveryMethod';

export const RecoveryMethods: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { capture } = useAnalyticsContext();
  const { path } = useRouteMatch();
  console.log('path: ', path);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const {
    isLoadingRecoveryMethods,
    recoveryMethods,
    hasFidoConfigured,
    hasMfaConfigured,
    hasTotpConfigured,
  } = useSeedlessMfaManager();
  // console.log('isLoadingRecoveryMethods: ', isLoadingRecoveryMethods);
  // console.log('recoveryMethods: ', recoveryMethods);
  // console.log('hasFidoConfigured: ', hasFidoConfigured);
  // console.log('hasMfaConfigured: ', hasMfaConfigured);
  // console.log('hasTotpConfigured: ', hasTotpConfigured);

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
                  // methodName={t('Authenticator')}
                  onClick={() => {
                    capture('ConfigureTotpClicked');
                    setSelectedMethod(method);
                    // setScreen(RecoveryMethodScreen.Authenticator);
                  }}
                />
              );
            }

            return (
              <RecoveryMethodCard
                method={method}
                key={method.id}
                // methodName={method.name}
                onClick={() => {
                  capture('ConfigureFidoClicked');
                  console.log('method clicked: ', method);
                  setSelectedMethod(method);
                  // history.push(`${path}/recovery-method`);
                  // setFidoDetails(method);
                  // setScreen(RecoveryMethodScreen.FidoDetails);
                }}
              />
            );
          })
        )}
        <Button
          // ref={submitRef}
          variant="contained"
          color="primary"
          size="extension"
          fullWidth
          // disabled={!isFormValid || isSubmitting}
          // loading={isSubmitting}
          // onClick={isFormValid ? handleSubmit : undefined}
          sx={{ mt: 'auto' }}
        >
          {t('Add recovery method')}
        </Button>
      </Paper>
    </Page>
  );
};
