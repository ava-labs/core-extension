import { ViewModeSwitcher } from '@/components/Header/ViewModeSwitcher';
import { Box, Fade, Stack, useTheme } from '@avalabs/k2-alpine';
import { useGoBack } from '@core/ui';
import { FC } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { OverflowingTypography } from './OverflowingTypography';

type Props = {
  showBack?: boolean;
  onBackClicked?: () => void;
  title?: string;
  isObserving?: boolean;
  isIntersecting?: boolean;
  showViewSwitcher?: boolean;
};

export const PageTopBar: FC<Props> = ({
  showBack,
  onBackClicked,
  isObserving,
  isIntersecting,
  title,
  showViewSwitcher = true,
}) => {
  const theme = useTheme();
  const goBack = useGoBack();
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      px={1.5}
      py={2}
      gap={1}
      width="100%"
      overflow="hidden"
      minHeight={56}
      sx={{
        boxShadow:
          !isObserving || isIntersecting
            ? 'none'
            : `0 1px 0 0 ${theme.palette.divider}`,
      }}
    >
      {showBack && (
        <Box
          flexShrink={0}
          height={24}
          width={24}
          lineHeight="1"
          data-testid="page-back-button"
        >
          <MdArrowBack
            size={24}
            onClick={onBackClicked || goBack}
            cursor="pointer"
          />
        </Box>
      )}
      <Fade
        in={Boolean(title) && isObserving && !isIntersecting}
        mountOnEnter
        unmountOnExit
        appear={false}
      >
        <OverflowingTypography variant="h6">{title}</OverflowingTypography>
      </Fade>
      {showViewSwitcher && (
        <Box ml="auto">
          <ViewModeSwitcher />
        </Box>
      )}
    </Stack>
  );
};
