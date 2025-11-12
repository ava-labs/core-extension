import {
  getHexAlpha,
  Tab as MuiTab,
  Tabs as MuiTabs,
  styled,
  tabClasses,
  tabsClasses,
  TabsProps,
} from '@avalabs/k2-alpine';

type TabMenuProps = TabsProps & {
  size?: 'small' | 'large';
};

export const TabMenu = styled(({ size = 'large', ...props }: TabMenuProps) => (
  <MuiTabs {...props} data-size={size} />
))(({ theme, size }) => ({
  minHeight: size === 'small' ? 32 : 40,
  borderRadius: '21px',
  backgroundColor: getHexAlpha(theme.palette.primary.main, 10),

  [`& .${tabsClasses.indicator}`]: {
    height: '100%',
    borderRadius: '21px',
    transitionTimingFunction: 'cubic-bezier(0, 0, 0, 1.5)',
  },

  [`& .${tabsClasses.list}`]: {
    justifyContent: 'space-evenly',
  },
}));

export const Tab = styled(MuiTab)(({ theme }) => ({
  minWidth: 'unset',
  minHeight: 'unset',
  borderRadius: '48px',

  fontSize: '12px',

  transition: theme.transitions.create(['color']),

  [`&.${tabClasses.selected}`]: {
    color: theme.palette.primary.contrastText,
    zIndex: 1,
  },

  '[data-size="small"] &': {
    flex: 1,
    paddingBlock: theme.spacing(1),
    paddingInline: theme.spacing(2),
  },
  '[data-size="large"] &': {
    paddingBlock: theme.spacing(1.5),
    paddingInline: theme.spacing(4),
  },
}));
