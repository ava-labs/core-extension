import {
  ChevronRightIcon,
  ListItem,
  ListItemProps,
  ListItemText,
  OutboundIcon,
  styled,
} from '@avalabs/k2-alpine';
import { FC } from 'react';

import { openNewTab } from '@core/common';
import { useHistory } from 'react-router-dom';

type OwnProps = {
  href?: string;
  label: string;
  description?: string;
  labelVariant?: 'subtitle3';
  descriptionVariant?: 'caption2';
  onClick?: () => void;
};
type SettingsNavItemProps = Omit<ListItemProps, 'onClick'> & OwnProps;

export const SettingsNavItem: FC<SettingsNavItemProps> = ({
  label,
  description,
  children,
  href,
  secondaryAction,
  labelVariant,
  descriptionVariant,
  onClick,
  ...props
}) => {
  const history = useHistory();

  const hasLink = !!href;
  const isOutbound = hasLink && href.startsWith('https://');

  const endIcon =
    secondaryAction ??
    (hasLink ? (
      isOutbound ? (
        <OutboundIcon size={16} />
      ) : (
        <ChevronRightIcon size={16} />
      )
    ) : null);

  return (
    <StyledListItem
      onClick={() => {
        onClick?.();
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
            variant: labelVariant || 'subtitle1',
          },
          secondary: {
            variant: descriptionVariant || 'caption',
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
