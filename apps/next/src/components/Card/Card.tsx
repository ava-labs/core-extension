import { DARK_THEME_SURFACE_COLOR } from '@/config';
import {
  Card as K2Card,
  CardContent as K2CardContent,
  styled,
} from '@avalabs/k2-alpine';

export const Card = styled(K2Card)(({ theme }) => ({
  paddingBlock: theme.spacing(0.5),
  backgroundColor:
    // Discussing the right color for dark mode with the design team right now.
    // The previous one was rgba(255, 255, 255, 0.1), which led to issues when trying
    // to overlay something on top the card and make it have the same background.
    theme.palette.mode === 'light'
      ? theme.palette.surface.primary
      : DARK_THEME_SURFACE_COLOR,
  backgroundImage: 'none',
}));

export const CardContent = styled(K2CardContent)({
  padding: 0,
  '&:last-child': {
    paddingBottom: 0,
  },
});
