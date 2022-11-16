import { Typography, VerticalFlex } from '@avalabs/react-components';
import { PropsWithChildren } from 'react';
import { PageTitle, PageTitleVariant } from './PageTitle';
import { useTranslation } from 'react-i18next';
import { FunctionNames } from './FunctionIsOffline';
interface FunctionIsOfflineProps {
  functionName: string;
  network: string;
}

export function FunctionIsUnavailable({
  functionName,
  network,
  children,
}: PropsWithChildren<FunctionIsOfflineProps>) {
  const { t } = useTranslation();
  return (
    <VerticalFlex height="100%" width="100%">
      <PageTitle variant={PageTitleVariant.PRIMARY}>{functionName}</PageTitle>
      <VerticalFlex align="center" justify="center" grow="1">
        <Typography size={16} align="center" height="24px">
          {
            (t(
              'Sorry, {{functionName}} is unavailable on {{network}} network.'
            ),
            {
              functionName: FunctionNames[functionName] || functionName,
              network,
            })
          }
        </Typography>
        {children}
      </VerticalFlex>
    </VerticalFlex>
  );
}
