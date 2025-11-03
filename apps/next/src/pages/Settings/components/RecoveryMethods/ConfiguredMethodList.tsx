import { useTranslation } from 'react-i18next';
import { RecoveryMethodCard } from './RecoveryMethodCard';
import { useAnalyticsContext } from '@core/ui';
import { RecoveryMethodScreen } from './RecoveryMethods';
import { Paper } from '@avalabs/k2-alpine';

export const ConfiguredMethodList = ({
  existingRecoveryMethods,
  setSelectedMethod,
  setScreen,
}) => {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        width: '100%',
        backgroundColor: 'surface.primary',
      }}
    >
      {existingRecoveryMethods.map((method) => {
        if (method.type === 'totp') {
          return (
            <RecoveryMethodCard
              method={method}
              key="totp"
              methodName={t('Authenticator')}
              onClick={() => {
                capture('ConfigureTotpClicked');
                setSelectedMethod(method);
                setScreen(RecoveryMethodScreen.Method);
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
              setSelectedMethod(method);
              setScreen(RecoveryMethodScreen.Method);
            }}
          />
        );
      })}
    </Paper>
  );
};
