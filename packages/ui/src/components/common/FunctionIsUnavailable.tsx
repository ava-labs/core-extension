import { PropsWithChildren } from 'react';
import { PageTitle, PageTitleVariant } from './PageTitle';
import { Trans, useTranslation } from 'react-i18next';
import { getTranslatedFunctionName } from './FunctionIsOffline';
import { Stack, Typography } from '@avalabs/core-k2-components';
import { FunctionNames } from '@/hooks/useIsFunctionAvailable';
interface FunctionIsOfflineProps {
  functionName: FunctionNames;
  network: string;
}

export function FunctionIsUnavailable({
  functionName,
  network,
  children,
}: PropsWithChildren<FunctionIsOfflineProps>) {
  const { t } = useTranslation();

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
              functionName:
                getTranslatedFunctionName(functionName) ?? t('This Feature'),
              network,
            }}
          />
        </Typography>
        {children}
      </Stack>
    </Stack>
  );
}
