import {
  ChevronDownIcon,
  getHexAlpha,
  MenuItem,
  MenuList,
  Stack,
  styled,
  Typography,
} from '@avalabs/k2-alpine';
import { FC, type ReactElement } from 'react';
import { useHistory } from 'react-router-dom';

export const CardMenu = styled(MenuList)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  width: '100%',
  flex: '0 0 auto',
  backgroundColor: getHexAlpha(theme.palette.primary.main, 10),
  // @ts-expect-error - Broken Theme type in @avalabs/k2-alpine
  borderRadius: theme.shape.mediumBorderRadius,
}));

type CardMenuItemProps = {
  link: string;
  icon: ReactElement;
  text: string;
};

export const CardMenuItem: FC<CardMenuItemProps> = ({ link, icon, text }) => {
  const history = useHistory();

  return (
    <CardMenuItemContainer onClick={() => history.push(link)}>
      {icon}
      <Stack className="CardLikeMenuItem-text-wrapper">
        <Typography variant="button">{text}</Typography>
        <ChevronDownIcon className="CardLikeMenuItem-chevron" size={20} />
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
