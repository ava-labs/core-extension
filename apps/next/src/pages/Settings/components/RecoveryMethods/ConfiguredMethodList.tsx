import { useTranslation } from 'react-i18next';
import { RecoveryMethodCard } from './RecoveryMethodCard';
import { useAnalyticsContext } from '@core/ui';
import { RecoveryMethodScreen } from './RecoveryMethods';
import { Paper } from '@avalabs/k2-alpine';
import { RecoveryMethod } from '@core/types';
import { FC, Dispatch, SetStateAction } from 'react';

interface ConfiguredMethodListProps {
  existingRecoveryMethods: RecoveryMethod[];
  setSelectedMethod: Dispatch<SetStateAction<RecoveryMethod | null>>;
  setScreen: Dispatch<SetStateAction<RecoveryMethodScreen | undefined>>;
}

export const ConfiguredMethodList: FC<ConfiguredMethodListProps> = ({
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
        const isTotp = method.type === 'totp';
        const methodName = isTotp ? t('Authenticator') : method.name;
        const key = isTotp ? 'totp' : method.id;
        const captureEvent = isTotp
          ? 'ConfigureTotpClicked'
          : 'ConfigureFidoClicked';

        return (
          <RecoveryMethodCard
            key={key}
            method={method}
            methodName={methodName}
            onClick={() => {
              capture(captureEvent);
              setSelectedMethod(method);
              setScreen(RecoveryMethodScreen.Method);
            }}
          />
        );
      })}
    </Paper>
  );
};
