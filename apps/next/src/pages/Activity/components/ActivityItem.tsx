import { AnimatedSyncIcon } from '@/components/AnimatedSyncIcon';
import { Card } from '@/components/Card';
import { ListItem, ListItemText, ListItemTextProps } from '@avalabs/k2-alpine';
import { FC } from 'react';
import * as Styled from './Styled';

type Props = {
  title: string;
  subtitle: string;
  onClick: VoidFunction;
  pending: boolean;
};

const textSlotProps: ListItemTextProps['slotProps'] = {
  root: {
    sx: {
      margin: 0,
    },
  },
  primary: {
    variant: 'body3',
  },
  secondary: {
    variant: 'caption',
  },
};

export const ActivityItem: FC<Props> = ({
  title,
  subtitle,
  onClick,
  pending,
}) => {
  return (
    <Card noPadding>
      <ListItem
        disablePadding
        secondaryAction={<Styled.ChevronRightIcon size={24} />}
      >
        <Styled.ListItemButton onClick={onClick}>
          <Styled.ListItemIcon>
            <Styled.Avatar>
              <AnimatedSyncIcon size={20} data-active={pending} />
            </Styled.Avatar>
          </Styled.ListItemIcon>
          <ListItemText
            primary={title}
            secondary={subtitle}
            slotProps={textSlotProps}
          />
        </Styled.ListItemButton>
      </ListItem>
    </Card>
  );
};
