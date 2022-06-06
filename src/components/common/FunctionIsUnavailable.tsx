import { Typography, VerticalFlex } from '@avalabs/react-components';
import { PropsWithChildren } from 'react';
import { PageTitle, PageTitleVariant } from './PageTitle';

interface FunctionIsOfflineProps {
  functionName: string;
  network: string;
}

export function FunctionIsUnavailable({
  functionName,
  network,
  children,
}: PropsWithChildren<FunctionIsOfflineProps>) {
  return (
    <VerticalFlex height="100%" width="100%">
      <PageTitle variant={PageTitleVariant.PRIMARY}>{functionName}</PageTitle>
      <VerticalFlex align="center" justify="center" grow="1">
        <Typography size={16} align="center" height="24px">
          Sorry, {functionName} is unavailable on {network} network.
        </Typography>
        {children}
      </VerticalFlex>
    </VerticalFlex>
  );
}
