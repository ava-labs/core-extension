import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import {
  ArrowRightIcon,
  Stack,
  styled,
  type SxProps,
  Typography,
} from '@avalabs/k2-alpine';
import { openNewTab } from '@core/common';
import { Card } from '@/components/Card';
import { HighlightBannerConfig } from './types';

const SlideCard = styled(Card)({
  cursor: 'pointer',
  backgroundColor: 'background.paper',
  flexShrink: 0,
  width: '100%',
  scrollSnapAlign: 'start',
  overflow: 'hidden',
});

const bannerTextSx: SxProps = { fontWeight: 600, lineHeight: 1.2 };

type HighlightBannerSlideProps = {
  banner: HighlightBannerConfig;
};

export const HighlightBannerSlide: FC<HighlightBannerSlideProps> = ({
  banner,
}) => {
  const { push } = useHistory();

  const handleClick = () => {
    if (banner.action.type === 'internal') {
      push(banner.action.path);
    } else {
      openNewTab({ url: banner.action.url });
    }
  };

  return (
    <SlideCard onClick={handleClick}>
      <Stack
        alignItems="center"
        justifyContent="space-between"
        direction="row"
        width="100%"
        gap={1.5}
      >
        {banner.icon}
        <Stack flex={1} minWidth={0} gap="1px">
          <Typography variant="subtitle3" sx={bannerTextSx}>
            {banner.title}
          </Typography>
          <Typography
            variant="subtitle3"
            color="text.secondary"
            sx={bannerTextSx}
          >
            {banner.description}
          </Typography>
        </Stack>
        <ArrowRightIcon size={22} />
      </Stack>
    </SlideCard>
  );
};
