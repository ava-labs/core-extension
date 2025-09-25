import { Box, Fade, Stack, Tooltip, Typography } from '@avalabs/k2-alpine';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdInfoOutline } from 'react-icons/md';

export const CoreFeeNotice = () => {
  const { t } = useTranslation();
  const [coreFee, _setCoreFee] = useState<string | undefined>();

  return (
    <Fade in={Boolean(coreFee)}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        gap={0.5}
      >
        <Typography variant="caption" color="text.secondary" textAlign="center">
          {t('Quote includes an {{coreFee}} Core fee', {
            coreFee,
          })}
        </Typography>
        <Tooltip
          title={
            coreFee
              ? t(
                  'Core always finds the best price from the top liquidity providers. A fee of {{coreFee}} is automatically factored into this quote.',
                  {
                    coreFee,
                  },
                )
              : ''
          }
        >
          <Box
            display="flex"
            flexShrink={0}
            lineHeight={1}
            color="text.secondary"
          >
            <MdInfoOutline color="text.secondary" size={16} />
          </Box>
        </Tooltip>
      </Stack>
    </Fade>
  );
};
