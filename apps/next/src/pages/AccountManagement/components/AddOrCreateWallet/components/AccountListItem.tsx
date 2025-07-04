import {
  ChevronRightIcon,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemTextProps,
} from '@avalabs/k2-alpine';
import { ComponentType, FC } from 'react';
import * as Styled from './Styled';

const listItemTextProps: ListItemTextProps['slotProps'] = {
  primary: {
    variant: 'subtitle1',
  },
  secondary: {
    variant: 'caption',
  },
};

type Props = {
  Icon: ComponentType<{ size?: number | string }>;
  primary: string;
  secondary: string;
  onClick: VoidFunction;
};

export const AccountListItem: FC<Props> = ({
  Icon,
  primary,
  secondary,
  onClick,
}) => {
  return (
    <Styled.ListItem disablePadding>
      <ListItemButton onClick={onClick}>
        <ListItemIcon>
          <Icon size={20} />
        </ListItemIcon>
        <ListItemText
          primary={primary}
          secondary={secondary}
          slotProps={listItemTextProps}
        />
        <ListItemIcon>
          <ChevronRightIcon size={24} />
        </ListItemIcon>
      </ListItemButton>
    </Styled.ListItem>
  );
};
