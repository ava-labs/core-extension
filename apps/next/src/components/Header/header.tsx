import {
  Stack,
  useTheme,
  getHexAlpha,
  Select,
  MenuItem,
  styled,
  Typography,
} from '@avalabs/k2-alpine';
import { useAccountsContext } from '@core/ui';
import { MdQrCode2 } from 'react-icons/md';
import { MdOutlineUnpublished } from 'react-icons/md';
import { MdCheckCircle } from 'react-icons/md';
import { MdOutlineSettings } from 'react-icons/md';
import { MdError } from 'react-icons/md';
import { AVATAR_OPTIONS, PersonalAvatar } from '../PersonalAvatar';

const AddressList = styled(Select)`
  /* display: none; */
`;
export const Header = () => {
  const { accounts } = useAccountsContext();
  const activeAccount = accounts.active;
  const theme = useTheme();
  console.log('theme: ', theme);
  console.log('accounts: ', accounts);
  return (
    <>
      <Stack
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          background: getHexAlpha(theme.palette.background.default, 60),
          zIndex: theme.zIndex.appBar,
          width: '100%',
          height: '56px',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 1,
        }}
      >
        <Stack>
          <Stack
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <PersonalAvatar name={AVATAR_OPTIONS[0]} size="small" />
            <Typography variant="body1">{activeAccount?.name}</Typography>
          </Stack>
          <AddressList
            labelId="label2-id"
            value={'option-4'}
            label={'Label'}
            onChange={(e) => {
              console.log('e: ', e);
            }}
            sx={{
              backgroundColor: theme.palette.background.paper,
              alignItems: 'center',

              // borderRadius: theme.shape.borderRadius,
            }}
            MenuProps={{
              hideBackdrop: true,
              PaperProps: {
                sx: {
                  background: 'red',
                },
              },
            }}
          >
            <MenuItem value="borderless-option-1">
              <MdQrCode2 size={24} />
              Option 1
            </MenuItem>
            <MenuItem value="borderless-option-2">Option 2</MenuItem>
            <MenuItem value="borderless-option-3">Option 3</MenuItem>
            <MenuItem
              value="option-4"
              sx={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 1,
                display: 'none',
              }}
            >
              <PersonalAvatar name={AVATAR_OPTIONS[0]} size="small" />
              <Typography variant="body1">{activeAccount?.name}</Typography>
            </MenuItem>
          </AddressList>
        </Stack>
        <Stack sx={{ flexDirection: 'row', gap: 1 }}>
          <MdCheckCircle size={24} color={theme.palette.success.main} />
          {/* <MdOutlineUnpublished size={24} />
          <MdError size={24} color={theme.palette.error.main} /> */}
          <MdQrCode2 size={24} />
          <MdOutlineSettings size={24} />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <mask
              id="mask0_6447_2562"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="24"
              height="24"
            >
              <rect
                x="0.5"
                y="0.5"
                width="23"
                height="23"
                fill="#D9D9D9"
                stroke="white"
              />
            </mask>
            <g mask="url(#mask0_6447_2562)">
              <mask id="path-2-inside-1_6447_2562" fill="white">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18 6H6C5.44772 6 5 6.44772 5 7V17C5 17.5523 5.44772 18 6 18H18C18.5523 18 19 17.5523 19 17V7C19 6.44772 18.5523 6 18 6ZM6 4C4.34315 4 3 5.34315 3 7V17C3 18.6569 4.34315 20 6 20H18C19.6569 20 21 18.6569 21 17V7C21 5.34315 19.6569 4 18 4H6Z"
                />
              </mask>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18 6H6C5.44772 6 5 6.44772 5 7V17C5 17.5523 5.44772 18 6 18H18C18.5523 18 19 17.5523 19 17V7C19 6.44772 18.5523 6 18 6ZM6 4C4.34315 4 3 5.34315 3 7V17C3 18.6569 4.34315 20 6 20H18C19.6569 20 21 18.6569 21 17V7C21 5.34315 19.6569 4 18 4H6Z"
                fill="#28282E"
              />
              <path
                d="M6 8H18V4H6V8ZM7 7C7 7.55228 6.55229 8 6 8V4C4.34315 4 3 5.34315 3 7H7ZM7 17V7H3V17H7ZM6 16C6.55228 16 7 16.4477 7 17H3C3 18.6569 4.34315 20 6 20V16ZM18 16H6V20H18V16ZM17 17C17 16.4477 17.4477 16 18 16V20C19.6569 20 21 18.6569 21 17H17ZM17 7V17H21V7H17ZM18 8C17.4477 8 17 7.55229 17 7H21C21 5.34315 19.6569 4 18 4V8ZM5 7C5 6.44772 5.44772 6 6 6V2C3.23858 2 1 4.23858 1 7H5ZM5 17V7H1V17H5ZM6 18C5.44772 18 5 17.5523 5 17H1C1 19.7614 3.23858 22 6 22V18ZM18 18H6V22H18V18ZM19 17C19 17.5523 18.5523 18 18 18V22C20.7614 22 23 19.7614 23 17H19ZM19 7V17H23V7H19ZM18 6C18.5523 6 19 6.44772 19 7H23C23 4.23858 20.7614 2 18 2V6ZM6 6H18V2H6V6Z"
                fill="white"
                mask="url(#path-2-inside-1_6447_2562)"
              />
              <rect
                x="16.5"
                y="7.5"
                width="1"
                height="9"
                rx="0.5"
                stroke="white"
              />
            </g>
          </svg>
        </Stack>
      </Stack>
    </>
  );
};
