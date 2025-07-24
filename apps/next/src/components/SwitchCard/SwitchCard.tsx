import {
  Stack,
  styled,
  Switch,
  Typography,
  TypographyProps,
} from '@avalabs/k2-alpine';

import { Card } from '../Card';

type Orientation = 'horizontal' | 'vertical';

interface SwitchCardProps {
  title: string;
  titleProps?: TypographyProps;
  description: string;
  orientation?: Orientation;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}

const defaultTitleProps: TypographyProps = {
  variant: 'h6',
};

export const SwitchCard = ({
  title,
  description,
  orientation = 'vertical',
  checked,
  disabled,
  onChange,
  titleProps = defaultTitleProps,
}: SwitchCardProps) => {
  return (
    <StyledSwitchCard orientation={orientation}>
      <Stack gap={1}>
        <Typography {...titleProps}>{title}</Typography>
        <Typography variant="caption" color="text.secondary">
          {description}
        </Typography>
      </Stack>

      <Switch
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        aria-label={description}
        size="medium"
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
