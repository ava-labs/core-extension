import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Box, Stack, styled } from '@avalabs/k2-alpine';
import { useSettingsContext } from '@core/ui';
import { PageControl } from '@/components/PageControl';
import { TrendingTokenSlide } from '@/pages/TrendingTokens/components/banner/TrendingTokenBanner';
import { HighlightBannerSlide } from './HighlightBannerSlide';
import { useHighlightBanners } from './highlightBanners';

export const HighlightsBannerCarousel: FC = () => {
  const { showHighlightBanners } = useSettingsContext();
  const highlightBanners = useHighlightBanners();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalSlides = 1 + highlightBanners.length;

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const slideWidth = container.offsetWidth;
    if (slideWidth === 0) return;

    const index = Math.round(container.scrollLeft / slideWidth);
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (!showHighlightBanners) {
    return null;
  }

  return (
    <Stack gap={1} alignItems="center">
      <ScrollContainer ref={scrollRef}>
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
