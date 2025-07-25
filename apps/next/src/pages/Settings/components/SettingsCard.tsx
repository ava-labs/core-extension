import { Card } from '@/components/Card';
import { CardProps, List, Stack, styled, Typography } from '@avalabs/k2-alpine';
import { FC } from 'react';

type SettingsCardProps = CardProps & {
  title: string;
  description?: string;
};

export const SettingsCard: FC<SettingsCardProps> = ({
  children,
  title,
  description,
  ...cardProps
}) => {
  return (
    <StyledCard {...cardProps}>
      <Stack gap={0.5}>
        {/* TODO: unify typography, remove fontSize & fontWeight */}
        <Typography variant="h3" fontSize={18} fontWeight="700 !important">
          {title}
        </Typography>
        {description && (
          <Typography variant="caption">{description}</Typography>
        )}
      </Stack>

      <List component="nav">{children}</List>
    </StyledCard>
  );
};

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(1.5),
  gap: theme.spacing(1.5),
  width: '100%',
}));
