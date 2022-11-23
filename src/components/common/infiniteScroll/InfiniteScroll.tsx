import {
  VerticalFlex,
  Typography,
  LoadingSpinnerIcon,
} from '@avalabs/react-components';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import { Scrollbars } from '../scrollbars/Scrollbars';

export interface InfiniteScrollProps {
  loadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  error?: string;
  children?: JSX.Element;
}

const Padded = styled.div`
  padding-bottom: 72px;
`;

export function InfiniteScroll({
  loadMore,
  hasMore,
  loading,
  error,
  children,
}: InfiniteScrollProps) {
  const loader = useRef(null);
  const theme = useTheme();
  const { t } = useTranslation();

  const loadMoreHandler = useCallback(
    (entries) => {
      const target = entries[0];

      if (target.isIntersecting && !loading && hasMore) {
        loadMore();
      }
    },
    [loading, hasMore, loadMore]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    };
    const loaderValue = loader.current;
    const observer = new IntersectionObserver(loadMoreHandler, option);
    if (loaderValue && observer) {
      observer.observe(loaderValue);
    }

    return () => {
      if (loaderValue && observer) {
        observer.unobserve(loaderValue);
      }
    };
  }, [loadMoreHandler]);

  return (
    <Scrollbars>
      {children}
      {loading && (
        <VerticalFlex paddingBottom="16px">
          <LoadingSpinnerIcon height="40px" color={theme.colors.icon1} />
        </VerticalFlex>
      )}
      {error && <Typography>{t('Error!')}</Typography>}
      <Padded ref={loader} />
    </Scrollbars>
  );
}
