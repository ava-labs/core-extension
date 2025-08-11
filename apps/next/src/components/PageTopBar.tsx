import { FC } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { Fade, Typography, useTheme } from '@avalabs/k2-alpine';
import { useGoBack } from '@core/ui';
import { ViewModeSwitcher } from '@/components/Header/ViewModeSwitcher';
import { StackRow } from './StackRow';

type Props = {
  showBack?: boolean;
  onBackClicked?: () => void;
  title?: string;
  isObserving?: boolean;
  isIntersecting?: boolean;
};

export const PageTopBar: FC<Props> = ({
  showBack,
  onBackClicked,
  isObserving,
  isIntersecting,
  title,
}) => {
  const theme = useTheme();
  const goBack = useGoBack();
  return (
    <StackRow
      justifyContent="space-between"
      px={1.5}
      py={2}
      borderBottom={
        !isObserving || isIntersecting
          ? 'none'
          : `1px solid ${theme.palette.divider}`
      }
      width="100%"
    >
      <StackRow gap={1} alignItems="center">
        {showBack && (
          <MdArrowBack
            size={24}
            onClick={onBackClicked || goBack}
            cursor="pointer"
          />
        )}
        {title && (
          <Fade in={isObserving && !isIntersecting}>
            <Typography variant="h6">{title}</Typography>
          </Fade>
        )}
      </StackRow>
      <ViewModeSwitcher />
    </StackRow>
  );
};
