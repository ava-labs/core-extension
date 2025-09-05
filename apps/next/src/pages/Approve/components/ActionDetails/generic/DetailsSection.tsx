import {
  CardProps,
  combineSx,
  Divider,
  DividerProps,
  Stack,
  styled,
} from '@avalabs/k2-alpine';

import { Card } from '@/components/Card';

type DetailsSectionProps = CardProps & {
  dimmedDivider?: boolean;
};

export const DetailsSection = ({
  children,
  sx,
  dimmedDivider = false,
  ...props
}: DetailsSectionProps) => {
  return (
    <Card sx={combineSx({ overflow: 'visible', width: '100%' }, sx)} {...props}>
      <Stack divider={<StyledDivider dimmed={dimmedDivider} />}>
        {children}
      </Stack>
    </Card>
  );
};

/**
 * Some children might be null, which breaks <Stack>'s "divider" prop.
 * We need to hide the dividers if they're either first, last or next to another.
 */
type StyledDividerProps = DividerProps & {
  dimmed?: boolean;
};
const StyledDivider = styled(Divider, {
  shouldForwardProp: (prop) => prop !== 'dimmed',
})<StyledDividerProps>(({ theme, dimmed }) => ({
  marginInline: theme.spacing(2),
  '&:last-child, &:first-child, &+&': {
    display: 'none',
  },
  opacity: dimmed ? 0.5 : 1,
}));
