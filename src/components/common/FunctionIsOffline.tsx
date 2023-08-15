import { PropsWithChildren } from 'react';
import { PageTitle, PageTitleVariant } from './PageTitle';
import { t as translate } from 'i18next';
import { Stack, Typography } from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';

interface FunctionIsOfflineProps {
  functionName: 'Bridge' | 'Send' | 'Swap' | 'Buy';
  hidePageTitle?: boolean;
}

export const FunctionNames = {
  Bridge: translate('Bridge'),
  Swap: translate('Swap'),
  Send: translate('Send'),
  Buy: translate('Buy'),
};

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
        <Typography size={16} align="center" height="24px">
          {t('Sorry, {{functionName}} is currently unavailable.', {
            functionName: FunctionNames[functionName] || functionName,
          })}
        </Typography>
        <Typography>{t('Please check back later.')}</Typography>
        {children}
      </Stack>
    </Stack>
  );
}
