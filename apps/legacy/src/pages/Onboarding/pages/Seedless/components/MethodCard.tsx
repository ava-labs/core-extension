import {
  Card,
  Stack,
  Typography,
  ChevronRightIcon,
  CardActionArea,
  useTheme,
} from '@avalabs/core-k2-components';
import { ReactElement } from 'react';
import { InlineBold } from '@/components/common/InlineBold';

interface MethodCardProps {
  icon: ReactElement;
  title: string;
  description: string;
  onClick: () => void;
}

export function MethodCard({
  icon,
  title,
  description,
  onClick,
}: MethodCardProps) {
  const theme = useTheme();
  return (
    <Card
      data-testid={`method-card-${title}`}
      onClick={onClick}
      sx={{
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <CardActionArea>
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            color: theme.palette.text.primary,
          }}
        >
          <Stack sx={{ flexDirection: 'row', columnGap: 2 }}>
            {icon}
            <Stack>
              <Typography variant="h6" sx={{ mb: 1 }}>
                <InlineBold>{title}</InlineBold>
              </Typography>
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                }}
              >
                {description}
              </Typography>
            </Stack>
          </Stack>
          <ChevronRightIcon size={24} />
        </Stack>
      </CardActionArea>
    </Card>
  );
}
