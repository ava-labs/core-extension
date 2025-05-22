import { PropsWithChildren } from 'react';
import { PageTitle, PageTitleVariant } from './PageTitle';
import { t as translate } from 'i18next';
import {
  AlertCircleIcon,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';
import { FunctionNames } from '@core/ui';

interface FunctionIsOfflineProps {
  functionName: FunctionNames;
  hidePageTitle?: boolean;
}

export function getTranslatedFunctionName(name: FunctionNames) {
  const translations = {
    [FunctionNames.BRIDGE]: translate('Bridge'),
    [FunctionNames.SWAP]: translate('Swap'),
    [FunctionNames.SEND]: translate('Send'),
    [FunctionNames.BUY]: translate('Buy'),
    [FunctionNames.DEFI]: translate('DeFi'),
    [FunctionNames.KEYSTONE]: translate('Keystone'),
    [FunctionNames.TOKEN_DETAILS]: translate('Token Details'),
  };

  return translations[name];
}

export function FunctionIsOffline({
  functionName,
  hidePageTitle,
  children,
}: PropsWithChildren<FunctionIsOfflineProps>) {
  const { t } = useTranslation();

  return (
    <Stack sx={{ height: '100%', width: '100%' }}>
      {!hidePageTitle && (
        <PageTitle variant={PageTitleVariant.PRIMARY}>{t('Sorry')}</PageTitle>
      )}
      <Stack
        sx={{ alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}
      >
        <AlertCircleIcon size={72} sx={{ mb: 3, mt: -9 }} />
        <Typography variant="h5" sx={{ mb: 1 }}>
          {t('Feature Disabled')}
        </Typography>
        <Typography
          size={16}
          align="center"
          height="24px"
          sx={{ color: 'text.secondary' }}
        >
          {t('{{functionName}} is currently unavailable.', {
            functionName:
              getTranslatedFunctionName(functionName) ?? t('This Feature'),
          })}
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          {t('Please check back later and try again.')}
        </Typography>
        {children}
      </Stack>
    </Stack>
  );
}
