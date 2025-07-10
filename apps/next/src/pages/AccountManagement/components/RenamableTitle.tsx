import {
  accordionSummaryClasses,
  Box,
  IconButton,
  listItemClasses,
  styled,
  Typography,
  TypographyProps,
} from '@avalabs/k2-alpine';
import { FC, MouseEventHandler } from 'react';
import { MdModeEdit } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import { URL_SEARCH_TOKENS } from '../utils/searchParams';

type Props = TypographyProps & {
  type: 'account' | 'wallet';
  tokenId: string;
};

const RenameButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.25),
  opacity: 0,
  marginLeft: 0,
  width: 0,
  transition: theme.transitions.create(['opacity', 'margin-left', 'width']),
  [`.${listItemClasses.root}:hover &, .${accordionSummaryClasses.root}:hover &`]:
    {
      opacity: 1,
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
}));

export const RenamableTitle: FC<Props> = ({
  children,
  type,
  tokenId,
  width,
  ...props
}) => {
  const { push } = useHistory();

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
    push({
      pathname: '/account-management/rename',
      search: new URLSearchParams({
        [URL_SEARCH_TOKENS[type]]: tokenId,
      }).toString(),
    });
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      width={width ?? 1}
      overflow="hidden"
    >
      <Typography
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
        {...props}
      >
        {children}
      </Typography>
      <RenameButton onClick={handleClick} size="small">
        <MdModeEdit size={12} color={props.color} />
      </RenameButton>
    </Box>
  );
};
