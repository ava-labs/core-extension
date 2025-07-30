import { FC } from 'react';
import {
  ListItem,
  ListItemText,
  ListItemProps,
  OutboundIcon,
  styled,
  ChevronRightIcon,
} from '@avalabs/k2-alpine';

import { openNewTab } from '@core/common';
import { useHistory } from 'react-router-dom';

type OwnProps = { href?: string; label: string; description?: string };
type SettingsNavItemProps = Omit<ListItemProps, 'onClick'> & OwnProps;

export const SettingsNavItem: FC<SettingsNavItemProps> = ({
  label,
  description,
  children,
  href,
  secondaryAction,
  ...props
}) => {
  const history = useHistory();

  const hasLink = !!href;
  const isOutbound = hasLink && href.startsWith('https://');

  const endIcon =
    secondaryAction ??
    (hasLink ? isOutbound ? <OutboundIcon /> : <ChevronRightIcon /> : null);

  return (
    <StyledListItem
      onClick={() => {
        if (!hasLink) {
          return;
        }

        if (isOutbound) {
          openNewTab({ url: href });
        } else {
          history.push(href);
        }
      }}
      secondaryAction={endIcon}
      {...props}
    >
      <ListItemText
        slotProps={{
          primary: {
            variant: 'subtitle3',
            // TODO: remove typography override once we have a proper typography component
            fontSize: '12px !important',
            fontWeight: '500 !important',
          },
          secondary: {
            variant: 'caption',
            marginTop: 0.5,
          },
        }}
        primary={label}
        secondary={description}
      />
    </StyledListItem>
  );
};

const StyledListItem = styled((props: ListItemProps) => (
  <ListItem {...props} disableGutters />
))(({ theme }) => ({
  paddingBlock: theme.spacing(0.75),
  cursor: 'pointer',
}));
