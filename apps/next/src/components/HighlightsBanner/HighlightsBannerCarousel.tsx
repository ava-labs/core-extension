import { FC, UIEventHandler, useCallback, useState } from 'react';
import { Box, Stack, styled } from '@avalabs/k2-alpine';
import { useSettingsContext } from '@core/ui';
import { PageControl } from '@/components/PageControl';
import { TrendingTokenSlide } from './trendingToken/TrendingTokenSlide';
import { HighlightBannerSlide } from './HighlightBannerSlide';
import { useHighlightBanners } from './highlightBanners';

export const HighlightsBannerCarousel: FC = () => {
  const { showHighlightBanners } = useSettingsContext();
  const highlightBanners = useHighlightBanners();
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalSlides = 1 + highlightBanners.length;

  const handleScroll = useCallback<UIEventHandler<HTMLDivElement>>((event) => {
    const container = event.currentTarget;
    const slideWidth = container.offsetWidth;
    if (slideWidth === 0) return;

    const index = Math.round(container.scrollLeft / slideWidth);
    setCurrentIndex(index);
  }, []);

  if (!showHighlightBanners) {
    return null;
  }

  return (
    <Stack gap={1} alignItems="center" mb={1.5}>
      <ScrollContainer onScroll={handleScroll}>
        <Slide>
          <TrendingTokenSlide />
        </Slide>
        {highlightBanners.map((banner) => (
          <Slide key={banner.id}>
            <HighlightBannerSlide banner={banner} />
          </Slide>
        ))}
      </ScrollContainer>
      {totalSlides > 1 && (
        <PageControl current={currentIndex + 1} total={totalSlides} />
      )}
    </Stack>
  );
};

const ScrollContainer = styled(Box)({
  display: 'flex',
  overflowX: 'auto',
  scrollSnapType: 'x mandatory',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
  width: '100%',
});

const Slide = styled(Box)({
  flex: '0 0 100%',
  scrollSnapAlign: 'start',
});
