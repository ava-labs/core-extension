import {
  Box,
  ChevronDownIcon,
  getHexAlpha,
  MenuItem,
  Stack,
  StackProps,
  styled,
  Typography,
} from '@avalabs/k2-alpine';
import { FC, ReactNode, type ReactElement } from 'react';
import { useHistory } from 'react-router-dom';

type CardMenuProps = StackProps & { divider?: ReactNode };

export const CardMenu: FC<CardMenuProps> = styled(Stack)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  width: '100%',
  flex: '0 0 auto',
  backgroundColor: getHexAlpha(theme.palette.primary.main, 10),
  borderRadius: theme.shape.mediumBorderRadius,
}));

type CardMenuItemProps = {
  icon: ReactElement;
  text: string;
  description?: string;
  'data-testid'?: string;
} & (
  | {
      link: string;
    }
  | {
      onClick: () => void;
    }
);

export const CardMenuItem: FC<CardMenuItemProps> = ({
  icon,
  text,
  description,
  'data-testid': dataTestId,
  ...props
}) => {
  const history = useHistory();

  const onClick =
    'onClick' in props ? props.onClick : () => history.push(props.link);

  return (
    <CardMenuItemContainer onClick={onClick} data-testid={dataTestId}>
      {icon}
      <Stack className="CardLikeMenuItem-text-wrapper">
        <Stack gap={0.5}>
          <Typography variant="button">{text}</Typography>
          {description && (
            <Typography
              variant="subtitle1"
              color="text.secondary"
              whiteSpace="normal"
            >
              {description}
            </Typography>
          )}
        </Stack>
        <Box
          display="flex"
          flexShrink={0}
          alignItems="center"
          justifyContent="center"
        >
          <ChevronDownIcon className="CardLikeMenuItem-chevron" size={20} />
        </Box>
      </Stack>
    </CardMenuItemContainer>
  );
};

const CardMenuItemContainer = styled(MenuItem)(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: theme.spacing(3),
  color: theme.palette.text.primary,
  paddingLeft: theme.spacing(2.5),
  paddingRight: theme.spacing(2.5),
  transition: 'background-color .15s ease-in-out',

  '& .CardLikeMenuItem-chevron': {
    transform: 'rotate(-90deg) translateY(0px)',
    transition: 'transform .1s ease-in-out',
  },

  '& .CardLikeMenuItem-text-wrapper': {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    width: '100%',
    transition: 'color .1s ease-in-out',
  },
}));
