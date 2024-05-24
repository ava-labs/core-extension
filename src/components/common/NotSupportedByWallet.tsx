import { PropsWithChildren } from 'react';
import { PageTitle, PageTitleVariant } from './PageTitle';
import { Trans, useTranslation } from 'react-i18next';
import { getTranslatedFunctionName } from './FunctionIsOffline';
import { Stack, Typography } from '@avalabs/k2-components';
import { FunctionNames } from '@src/hooks/useIsFunctionAvailable';
interface NotSupportedByWalleteProps {
  functionName: FunctionNames;
  network: string;
}

export function NotSupportedByWallet({
  functionName,
  network,
  children,
}: PropsWithChildren<NotSupportedByWalleteProps>) {
  const { t } = useTranslation();

  const functionNameLabel =
    getTranslatedFunctionName(functionName) ?? t('This Feature');

  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <PageTitle variant={PageTitleVariant.PRIMARY}>
        {functionNameLabel}
      </PageTitle>
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
            i18nKey="Sorry, {{functionName}} on<br/>{{network}} network<br/>is not supported by this account."
            values={{
              functionName: functionNameLabel,
              network,
            }}
          />
        </Typography>
        {children}
      </Stack>
    </Stack>
  );
}
