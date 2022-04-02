import { Typography, VerticalFlex } from '@avalabs/react-components';
import { PropsWithChildren } from 'react';
import { PageTitleMiniMode, PageTitleVariant } from './PageTitle';

interface FunctionIsOfflineProps {
  functionName: string;
}

export function FunctionIsOffline({
  functionName,
  children,
}: PropsWithChildren<FunctionIsOfflineProps>) {
  return (
    <VerticalFlex height="100%" width="100%">
      <PageTitleMiniMode variant={PageTitleVariant.PRIMARY}>
        Sorry
      </PageTitleMiniMode>
      <VerticalFlex align="center" justify="center" grow="1">
        <Typography size={16} align="center" height="24px">
          Sorry, {functionName} is currently unavailable.
        </Typography>
        <Typography size={16} align="center" height="24px">
          Please check back later.
        </Typography>
        {children}
      </VerticalFlex>
    </VerticalFlex>
  );
}
