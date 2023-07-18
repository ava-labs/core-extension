import { Typography, VerticalFlex } from '@avalabs/react-components';
import { PropsWithChildren } from 'react';
import { PageTitle, PageTitleVariant } from './PageTitle';
import { t as translate } from 'i18next';
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
    <VerticalFlex height="100%" width="100%">
      {!hidePageTitle && (
        <PageTitle variant={PageTitleVariant.PRIMARY}>{t('Sorry')}</PageTitle>
      )}
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
