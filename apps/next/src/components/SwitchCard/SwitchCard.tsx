import {
  Stack,
  styled,
  Switch,
  Typography,
  TypographyVariant,
} from '@avalabs/k2-alpine';

import { Card } from '../Card';

type Orientation = 'horizontal' | 'vertical';

interface SwitchCardProps {
  title: string;
  description: string;
  orientation?: Orientation;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  titleSize: 'small' | 'large';
}
const titleStyles = {
  small: {
    variant: 'subtitle3' as TypographyVariant,
    // TODO: fix it after a proper k2 release
    fontWeight: 600,
  },
  large: {
    variant: 'h5' as TypographyVariant,
    fontWeight: 'fontWeightBold',
  },
};

export const SwitchCard = ({
  title,
  description,
  orientation = 'vertical',
  checked,
  disabled,
  onChange,
  titleSize = 'small',
}: SwitchCardProps) => {
  return (
    <StyledSwitchCard orientation={orientation}>
      <Stack gap={0.5}>
        <Typography {...titleStyles[titleSize]}>{title}</Typography>
        <Typography variant="caption" color="text.secondary">
          {description}
        </Typography>
      </Stack>

      <Switch
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        aria-label={description}
        size="small"
      />
    </StyledSwitchCard>
  );
};

type SwitchCardStyleProps = Pick<SwitchCardProps, 'orientation'>;

const StyledSwitchCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'orientation',
})<SwitchCardStyleProps>(({ orientation, theme }) => ({
  padding: theme.spacing(1.5),
  gap: theme.spacing(2.5),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: orientation === 'horizontal' ? 'center' : 'flex-start',
  flexDirection: orientation === 'horizontal' ? 'row' : 'column',
}));
