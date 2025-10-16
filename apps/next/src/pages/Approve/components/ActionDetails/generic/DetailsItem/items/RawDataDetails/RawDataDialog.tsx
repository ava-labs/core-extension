import {
  Button,
  getHexAlpha,
  Stack,
  styled,
  toast,
  Typography,
} from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Page } from '@/components/Page';
import { Card } from '@/components/Card';
import { SlideUpDialog } from '@/components/Dialog';
import { useIsIntersecting } from '@/hooks/useIsIntersecting';

type RawDataDialogProps = {
  title: string;
  data: string;
  onClose: () => void;
  open: boolean;
};

const pageProps = {
  withBackButton: true,
  withViewSwitcher: false,
  contentProps: {
    gap: 0,
    justifyContent: 'flex-start',
  },
  containerProps: {
    sx: {
      pb: 0,
    },
  },
} as const;

export const RawDataDialog: FC<RawDataDialogProps> = ({
  title,
  data,
  onClose,
  open,
}) => {
  const { t } = useTranslation();

  const handleCopy = () => {
    navigator.clipboard.writeText(data);
    toast.success(t('Copied to clipboard'));
  };

  const { isIntersecting, isObserving, ref } = useIsIntersecting({
    scrollMargin: '-20px',
  });

  return (
    <SlideUpDialog open={open} onClose={onClose}>
      <Page {...pageProps} onBack={onClose} title={title}>
        <Card sx={{ px: 2, py: 1.5 }}>
          <Typography variant="mono" sx={{ wordBreak: 'break-all' }}>
            {data}
            {data}
            {data}
            {data}
            {data}
            {data}
            {data}
            {data}
            {data}
            {data}
          </Typography>
        </Card>
        <div ref={ref} /> {/* scroll sentinel */}
        <CopyButtonWrapper withGradient={isObserving && !isIntersecting}>
          <CopyButton
            variant="contained"
            color="secondary"
            size="extension"
            onClick={handleCopy}
          >
            {t('Copy data')}
          </CopyButton>
        </CopyButtonWrapper>
      </Page>
    </SlideUpDialog>
  );
};

const CopyButton = styled(Button)({
  alignSelf: 'center', // Prevents it from stretching
});

/**
 * This is a sticky container at the bottom of the page. Its purpose so that
 * the "Copy" button is not semi-transparent above the scrollable data.
 */
const CopyButtonWrapper = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'withGradient',
})<{ withGradient?: boolean }>`
  @property --topColor {
    syntax: '<color>';
    initial-value: transparent;
    inherits: false;
  }

  @property --bottomColor {
    syntax: '<color>';
    initial-value: transparent;
    inherits: false;
  }

  width: 100%;
  position: sticky;
  bottom: 0;
  padding-top: ${({ theme }) => theme.spacing(3)};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  gap: ${({ theme }) => theme.spacing(1)};
  transition: ${({ theme }) =>
    theme.transitions.create(['--topColor, --bottomColor'])};

  background: linear-gradient(
    180deg,
    var(--topColor) 0%,
    var(--bottomColor) 22.5%
  );

  --topColor: ${({ theme, withGradient }) =>
    withGradient
      ? theme.palette.mode === 'light'
        ? 'rgba(255, 255, 255, 0.00)'
        : getHexAlpha('#29292f', 0)
      : 'transparent'};
  --bottomColor: ${({ theme, withGradient }) =>
    withGradient
      ? theme.palette.mode === 'light'
        ? '#fff'
        : '#29292f'
      : 'transparent'};
`;
