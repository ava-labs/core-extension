import {
  HorizontalFlex,
  InfoIcon,
  ParaswapIcon,
  Tooltip,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';

export function ParaswapNotice() {
  const { t } = useTranslation();
  const theme = useTheme();

  const TooltipContent = (
    <VerticalFlex width="240px">
      <Typography size={12}>
        {t('You will interact directly with Paraswap&apos;s smart contracts.')}
      </Typography>
    </VerticalFlex>
  );

  return (
    <HorizontalFlex align="center" justify="center">
      <Typography size={12} margin="0 6px 0 0">
        {t('Powered by')}
      </Typography>
      <ParaswapIcon color={theme.colors.text1} />
      <HorizontalFlex margin="0 0 0 6px">
        <Tooltip placement={'top'} content={TooltipContent}>
          <InfoIcon height="12px" color={theme.colors.text1} />
        </Tooltip>
      </HorizontalFlex>
    </HorizontalFlex>
  );
}
