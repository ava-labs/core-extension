import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useRef } from 'react';
import { Scrollbars } from '../scrollbars/Scrollbars';
import { CircularProgress, Stack, Typography } from '@avalabs/k2-components';

export interface InfiniteScrollProps {
  loadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  error?: string;
  children?: JSX.Element;
}

export function InfiniteScroll({
  loadMore,
  hasMore,
  loading,
  error,
  children,
}: InfiniteScrollProps) {
  const loader = useRef(null);
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
        <Stack sx={{ pb: 2, width: 1, alignItems: 'center' }}>
          <CircularProgress />
        </Stack>
      )}
      {error && <Typography variant="body1">{t('Error!')}</Typography>}
      <Stack sx={{ pb: 9 }} ref={loader} />
    </Scrollbars>
  );
}
