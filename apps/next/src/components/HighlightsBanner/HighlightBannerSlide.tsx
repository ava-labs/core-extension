import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { ArrowRightIcon, Stack, Typography } from '@avalabs/k2-alpine';
import { openNewTab } from '@core/common';
import { Card } from '@/components/Card';
import { HighlightBannerConfig } from './types';

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
    <Card
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        backgroundColor: 'background.paper',
        flexShrink: 0,
        width: '100%',
        scrollSnapAlign: 'start',
        overflow: 'hidden',
      }}
    >
      <Stack
        alignItems="center"
        justifyContent="space-between"
        direction="row"
        width="100%"
        gap={1.5}
      >
        {banner.icon}
        <Stack flex={1} minWidth={0} gap="1px">
          <Typography
            variant="subtitle3"
            sx={{ fontWeight: 600, lineHeight: 1.2 }}
          >
            {banner.title}
          </Typography>
          <Typography
            variant="subtitle3"
            color="text.secondary"
            sx={{ fontWeight: 600, lineHeight: 1.2 }}
          >
            {banner.description}
          </Typography>
        </Stack>
        <ArrowRightIcon size={22} />
      </Stack>
    </Card>
  );
};
