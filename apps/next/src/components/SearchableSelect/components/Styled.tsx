import {
  Popover,
  PopoverContent,
  PopoverProps,
  Stack,
  StackProps,
  styled,
} from '@avalabs/k2-alpine';

export const SearchableSelectMenuRoot = styled(Stack)({
  width: 'calc(100vw - 50px)',
  height: 'calc(100vh - 112px)',
  overflow: 'hidden',
  ul: { paddingInline: 0 },
});

export const SearchableSelectPopover = (props: PopoverProps) => (
  <Popover
    anchorReference="anchorPosition"
    anchorPosition={{ top: 100, left: 160 }}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'center',
      horizontal: 'center',
    }}
    {...props}
  />
);

export const NoScrollPopoverContent = styled(PopoverContent)({
  overflow: 'hidden',
});

export const SearchableSelectListBox = styled((props: StackProps) => (
  <Stack component="ul" {...props} />
))(({ theme }) => ({
  width: '100%',
  paddingBottom: theme.spacing(1),
  flexGrow: 1,
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
}));
