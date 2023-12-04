import {
  Card,
  Stack,
  Typography,
  ChevronRightIcon,
  CardActionArea,
  useTheme,
} from '@avalabs/k2-components';
import { ReactElement } from 'react';
import { InlineBold } from '@src/components/common/InlineBold';

interface MethodCardProps {
  icon: ReactElement;
  title: string;
  description: string;
  onClick: () => void;
  isActive: boolean;
}

export function MethodCard({
  icon,
  title,
  description,
  onClick,
  isActive,
}: MethodCardProps) {
  const theme = useTheme();
  return (
    <Card
      data-testid={`method-card-${title}`}
      onClick={onClick}
      sx={{
        backgroundColor: isActive
          ? theme.palette.primary.main
          : theme.palette.background.paper,
      }}
    >
      <CardActionArea>
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            color: isActive
              ? theme.palette.common.black
              : theme.palette.text.primary,
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
                  color: isActive
                    ? theme.palette.common.black
                    : theme.palette.text.secondary,
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
