import { ViewModeSwitcher } from '@/components/Header/ViewModeSwitcher';
import {
  Box,
  Fade,
  Stack,
  useTheme,
  ArrowBackIcon,
  getHexAlpha,
  styled,
} from '@avalabs/k2-alpine';
import { useNavigation, useOnline } from '@core/ui';
import { FC } from 'react';
import { HEADER_HEIGHT } from '@/config/constants';

import { OverflowingTypography } from './OverflowingTypography';
import { OfflineMessage } from './Header/OfflineMessage';

const StickyPageTopBar = styled(Stack)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  left: 0,
  width: '100%',
  zIndex: theme.zIndex.appBar,
  background: getHexAlpha(theme.palette.background.default, 60),
  backdropFilter: 'blur(30px)',
  WebkitBackdropFilter: 'blur(30px)',
}));

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
  const { goBack } = useNavigation();
  const { isOnline } = useOnline();
  return (
    <>
      <StickyPageTopBar className="page-top-bar">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          pl={1.5}
          pr={showViewSwitcher ? 0.5 : 1.5}
          py={2}
          gap={1}
          width="100%"
          overflow="hidden"
          minHeight={56}
          height={HEADER_HEIGHT}
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
              height={20}
              width={20}
              lineHeight="1"
              data-testid="page-back-button"
            >
              <ArrowBackIcon
                size={20}
                onClick={onBackClicked || (() => goBack(undefined))}
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
        {!isOnline && <OfflineMessage />}
      </StickyPageTopBar>
    </>
  );
};
