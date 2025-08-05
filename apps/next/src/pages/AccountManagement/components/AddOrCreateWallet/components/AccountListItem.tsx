import {
  ChevronRightIcon,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemTextProps,
} from '@avalabs/k2-alpine';
import {
  ComponentType,
  FC,
  MouseEvent,
  MouseEventHandler,
  useState,
} from 'react';
import * as Styled from './Styled';

const listItemTextProps: ListItemTextProps['slotProps'] = {
  primary: {
    variant: 'subtitle3',
  },
  secondary: {
    variant: 'caption',
  },
};

type Props = {
  Icon: ComponentType<{ size?: number | string }>;
  primary: string;
  secondary: string;
  onClick:
    | MouseEventHandler<HTMLButtonElement>
    | ((event: MouseEvent<HTMLButtonElement>) => Promise<void>);
};

export const AccountListItem: FC<Props> = ({
  Icon,
  primary,
  secondary,
  onClick,
}) => {
  const [isPending, setPending] = useState(false);
  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    setPending(true);
    try {
      await onClick(event);
    } finally {
      setPending(false);
    }
  };

  return (
    <Styled.ListItem disablePadding>
      <ListItemButton
        component="button"
        onClick={handleClick}
        disabled={isPending}
      >
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
