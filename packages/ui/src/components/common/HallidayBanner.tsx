import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardActionArea,
  Grow,
  IconButton,
  Link,
  Stack,
  Typography,
  XIcon,
} from '@avalabs/core-k2-components';

import { getCoreWebUrl } from '@core/common';
import { useDismissedBanners } from '@/hooks/useDismissedBanners';
import { useFeatureFlagContext } from '@/contexts/FeatureFlagsProvider';
import { FeatureGates } from '@core/types';

const HALLIDAY_BANNER_ID = 'halliday-e2d6f109-2175-4303-9321-17b010781371';

export const HallidayBanner = () => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const { isDismissed, dismiss } = useDismissedBanners();
  const { isFlagEnabled } = useFeatureFlagContext();

  useEffect(() => {
    if (!isFlagEnabled(FeatureGates.HALLIDAY_BRIDGE_BANNER)) {
      setIsOpen(false);
      return;
    }

    let isMounted = true;

    isDismissed(HALLIDAY_BANNER_ID).then((isHallidayDismissed) => {
      if (!isMounted) {
        return;
      }

      setIsOpen(!isHallidayDismissed);
    });

    return () => {
      isMounted = false;
    };
  }, [isDismissed, isFlagEnabled]);

  return (
    <Grow in={isOpen} unmountOnExit mountOnEnter>
      <Card sx={{ mx: 2, mb: 2, position: 'relative' }}>
        <IconButton
          size="small"
          sx={{ position: 'absolute', top: 4, right: 4, zIndex: 9999 }}
          onClick={() => {
            setIsOpen(false);
            dismiss(HALLIDAY_BANNER_ID);
          }}
        >
          <XIcon size={20} />
        </IconButton>
        <CardActionArea
          component={Link}
          href={`${getCoreWebUrl()}/bridge?useHalliday=1`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Stack sx={{ gap: 1, py: 1, px: 2 }}>
            <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center' }}>
              <img
                src="/images/halliday-icon.png"
                style={{ height: 24 }}
                alt="Halliday Logo"
              />
              <Typography variant="button" sx={{ fontSize: 'body2.fontSize' }}>
                {t('Bridge using Halliday')}
              </Typography>
            </Stack>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', lineHeight: 1.5 }}
            >
              {t(
                'Buy and bridge USD and other currencies directly to L1s using Halliday.',
              )}
            </Typography>
          </Stack>
        </CardActionArea>
      </Card>
    </Grow>
  );
};
