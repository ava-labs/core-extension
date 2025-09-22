import { FC, PropsWithChildren } from 'react';
import { Button, getHexAlpha, Slide, Stack, styled } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

type HardwareApprovalDrawerProps = PropsWithChildren<{
  reject: () => void;
}>;

export const HardwareApprovalDrawer: FC<HardwareApprovalDrawerProps> = ({
  children,
  reject,
}) => {
  const { t } = useTranslation();

  return (
    <Slide in direction="up">
      <Drawer>
        <DrawerContent>
          <Stack flexGrow={1}>{children}</Stack>
          <Button
            variant="contained"
            color="secondary"
            size="extension"
            onClick={reject}
          >
            {t('Cancel')}
          </Button>
        </DrawerContent>
      </Drawer>
    </Slide>
  );
};

const Drawer = styled(Stack)(({ theme }) => ({
  width: '100vw',
  height: '100vh',
  position: 'fixed',
  inset: 0,
  zIndex: 2000,
  background: getHexAlpha(
    theme.palette.neutral[850],
    theme.palette.mode === 'light' ? 30 : 50,
  ),
  justifyContent: 'flex-end',

  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
  animation: `fadeIn 0.15s ease-in-out`,
}));

const DrawerContent = styled(Stack)(({ theme }) => ({
  width: '100vw',
  height: '66.67vh',
  position: 'relative',
  gap: theme.spacing(1),
  paddingBlock: theme.spacing(2),
  paddingInline: theme.spacing(1.5),
  boxShadow: '0 -10px 32px 0 rgba(0, 0, 0, 0.10)',
  borderTop: `1px solid ${theme.palette.divider}`,
  background:
    theme.palette.mode === 'light'
      ? theme.palette.common.white
      : theme.palette.neutral[850],
}));
