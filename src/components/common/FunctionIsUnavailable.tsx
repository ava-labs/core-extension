import { PropsWithChildren } from 'react';
import { PageTitle, PageTitleVariant } from './PageTitle';
import { Trans } from 'react-i18next';
import { FunctionNames } from './FunctionIsOffline';
import { Stack, Typography } from '@avalabs/k2-components';
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
    <Stack
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <PageTitle variant={PageTitleVariant.PRIMARY}>{functionName}</PageTitle>
      <Stack
        sx={{
          flexGrow: 1,
          px: 4,
          alignContent: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body1" minHeight={24} align="center">
          <Trans
            i18nKey="Sorry, {{functionName}} is unavailable on <br/>{{network}} network."
            values={{
              functionName: FunctionNames[functionName] || functionName,
              network,
            }}
          />
        </Typography>
        {children}
      </Stack>
    </Stack>
  );
}
