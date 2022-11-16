import { Typography, VerticalFlex } from '@avalabs/react-components';
import { PropsWithChildren } from 'react';
import { PageTitle, PageTitleVariant } from './PageTitle';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

interface FunctionIsOfflineProps {
  functionName: 'Bridge' | 'Send' | 'Swap';
}

export const FunctionNames = {
  Bridge: t('Bridge'),
  Swap: t('Swap'),
  Send: t('Send'),
};

export function FunctionIsOffline({
  functionName,
  children,
}: PropsWithChildren<FunctionIsOfflineProps>) {
  const { t } = useTranslation();
  return (
    <VerticalFlex height="100%" width="100%">
      <PageTitle variant={PageTitleVariant.PRIMARY}>{t('Sorry')}</PageTitle>
      <VerticalFlex align="center" justify="center" grow="1">
        <Typography size={16} align="center" height="24px">
          {t('Sorry, {{functionName}} is currently unavailable.', {
            functionName: FunctionNames[functionName] || functionName,
          })}
        </Typography>
        <Typography size={16} align="center" height="24px">
          {t('Please check back later.')}
        </Typography>
        {children}
      </VerticalFlex>
    </VerticalFlex>
  );
}
