import { Stack, StackProps, Typography, styled } from '@avalabs/k2-alpine';

import { useIsIntersecting } from '@/hooks/useIsIntersecting';
import { OverflowingTypography } from '@/components/OverflowingTypography';

type ApprovalScreenTitleProps = StackProps & {
  title: string;
};
export const ApprovalScreenTitle = ({
  title,
  ...props
}: ApprovalScreenTitleProps) => {
  const { ref, isIntersecting, isObserving } = useIsIntersecting();

  return (
    <>
      <Stack px={2} mt={1.5} mb={3} {...props} ref={ref}>
        <Typography variant="h2">{title}</Typography>
      </Stack>
      <StickyHeader isIntersecting={isIntersecting} isObserving={isObserving}>
        <OverflowingTypography variant="h6" lineHeight="1">
          {title}
        </OverflowingTypography>
      </StickyHeader>
    </>
  );
};

type StickyHeaderProps = StackProps & {
  isIntersecting: boolean;
  isObserving: boolean;
};
const StickyHeader = styled(Stack, {
  shouldForwardProp: (prop) =>
    prop !== 'isIntersecting' && prop !== 'isObserving',
})<StickyHeaderProps>(({ theme, isIntersecting, isObserving }) => ({
  width: '100%',
  height: 56,
  position: 'fixed',
  top: 0,
  zIndex: 1,
  backgroundColor: theme.palette.background.backdrop,
  overflow: 'hidden',
  paddingBlock: theme.spacing(2),
  paddingInline: theme.spacing(1.5),
  transition: theme.transitions.create(['opacity']),
  opacity: isObserving && !isIntersecting ? 1 : 0,
  pointerEvents: isObserving && !isIntersecting ? 'auto' : 'none',
  borderBottom:
    isObserving && !isIntersecting
      ? `1px solid ${theme.palette.divider}`
      : 'none',
}));
