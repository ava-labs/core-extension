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

type Props = TypographyProps & {
  onRename: MouseEventHandler<HTMLButtonElement>;
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
  onRename,
  width,
  ...props
}) => {
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
      <RenameButton onClick={onRename} size="small">
        <MdModeEdit size={12} color={props.color} />
      </RenameButton>
    </Box>
  );
};
