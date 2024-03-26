import { Button, Stack, Tooltip, useTheme } from '@avalabs/k2-components';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTracker } from './PageTracker';

interface PageNavProps {
  onBack: () => void;
  backText?: string;
  onNext: () => void;
  nextText?: string;
  disableNext?: boolean;
  nextDisabledReason?: string;
  expand?: boolean;
  steps: number;
  activeStep: number;
}

export function PageNav({
  onBack,
  backText,
  onNext,
  nextText,
  disableNext,
  nextDisabledReason,
  steps,
  activeStep,
  children,
  expand,
}: PropsWithChildren<PageNavProps>) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Stack
      sx={{
        width: '100%',
        justifyItems: 'space-between',
        alignContent: 'center',
        my: 3,
        rowGap: `${expand && children ? theme.spacing(2) : theme.spacing(8)}`,
      }}
    >
      <Stack
        sx={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'center',
          columnGap: 2,
        }}
      >
        <Button
          color="secondary"
          data-testid="page-nav-back-button"
          onClick={async () => {
            onBack();
          }}
          sx={{
            width: theme.spacing(21),
          }}
        >
          {backText ? backText : t('Back')}
        </Button>
        <Tooltip title={nextDisabledReason} sx={{ cursor: 'not-allowed' }}>
          <Button
            data-testid="page-nav-next-button"
            disabled={disableNext}
            onClick={async () => {
              onNext();
            }}
            sx={{
              width: theme.spacing(21),
            }}
          >
            {nextText ? nextText : t('Next')}
          </Button>
        </Tooltip>
      </Stack>
      {expand && children && (
        <Stack sx={{ height: theme.spacing(4) }}>{children}</Stack>
      )}
      <PageTracker steps={steps} activeStep={activeStep} />
    </Stack>
  );
}
