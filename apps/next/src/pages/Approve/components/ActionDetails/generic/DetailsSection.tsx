import {
  CardProps,
  combineSx,
  Divider,
  Stack,
  styled,
} from '@avalabs/k2-alpine';

import { Card } from '@/components/Card';

export const DetailsSection = ({ children, sx, ...props }: CardProps) => {
  return (
    <Card sx={combineSx({ overflow: 'visible' }, sx)} {...props}>
      <Stack divider={<StyledDivider />}>{children}</Stack>
    </Card>
  );
};

/**
 * Some children might be null, which breaks <Stack>'s "divider" prop.
 * We need to hide the dividers if they're either first, last or next to another.
 */
const StyledDivider = styled(Divider)(({ theme }) => ({
  marginInline: theme.spacing(2),
  '&:last-child, &:first-child, &+&': {
    display: 'none',
  },
}));
