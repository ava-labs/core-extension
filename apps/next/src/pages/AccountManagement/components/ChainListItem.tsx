import {
  Box,
  getHexAlpha,
  ListItem,
  ListItemIcon,
  Stack,
  styled,
  Typography,
  TypographyProps,
} from '@avalabs/k2-alpine';
import {
  cloneElement,
  ComponentType,
  FC,
  isValidElement,
  ReactElement,
} from 'react';
import { IconBaseProps } from 'react-icons';

export type Props = {
  Icon: ComponentType<IconBaseProps> | ReactElement<IconBaseProps>;
  iconSize?: number;
  label: string;
  labelVariant?: TypographyProps['variant'];
  subtitle?: ReactElement;
  action?: ReactElement;
};

const ItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: 36,
  svg: {
    borderRadius: '50%',
    boxShadow: `inset 0 0 10px ${getHexAlpha(theme.palette.primary.main, 30)}`,
  },
}));

export const ChainListItem: FC<Props> = ({
  Icon,
  iconSize,
  label,
  labelVariant = 'subtitle1',
  subtitle,
  action,
}) => {
  return (
    <ListItem>
      <ItemIcon>
        {isValidElement(Icon) ? (
          iconSize ? (
            cloneElement(Icon, { size: iconSize })
          ) : (
            Icon
          )
        ) : (
          <Icon size={iconSize} />
        )}
      </ItemIcon>
      <Stack
        direction="column"
        gap={0}
        marginInlineEnd={1}
        sx={{ cursor: 'default', userSelect: 'none' }}
      >
        <Typography variant={labelVariant}>{label}</Typography>
        {subtitle}
      </Stack>
      {action && <Box marginInlineStart="auto">{action}</Box>}
    </ListItem>
  );
};
