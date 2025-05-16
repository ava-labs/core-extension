import {
  Button,
  ChevronDownIcon,
  ChevronRightIcon,
  Divider,
  EncryptedIcon,
  getHexAlpha,
  LedgerIcon,
  MenuItem,
  MenuList,
  Stack,
  styled,
  Typography,
} from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { Route, useHistory, useLocation } from 'react-router-dom';

import { FullscreenModal } from '@/components/FullscreenModal';

export const AccessExistingWallet = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();

  return (
    <FullscreenModal
      open={open}
      withCoreLogo
      withAppInfo
      withLanguageSelector
      onBack={history.goBack}
      onClose={onClose}
      title={t('How would you like to access your existing wallet?')}
    >
      <Stack
        sx={{
          flexDirection: 'row',
          width: 1,
          height: 1,
          overflow: 'hidden',
        }}
      >
        <Stack
          sx={{
            flexDirection: 'row',
            flexWrap: 'nowrap',
            width: 1,
            transition: 'transform .2s ease-in-out',
            transform: location.pathname.endsWith('/recovery-phrase')
              ? 'translateX(-100%)'
              : 'translateX(0)',
          }}
        >
          <CardLikeMenu sx={{ width: 1, flex: '0 0 auto' }}>
            <CardLikeMenuItem
              onClick={() =>
                history.push(
                  '/onboarding/access-existing-wallet/recovery-phrase',
                )
              }
            >
              <EncryptedIcon size={24} />
              <Stack className="CardLikeMenuItem-text-wrapper">
                <Typography variant="button">
                  {t('Manually enter a recovery phrase')}
                </Typography>
                <ChevronDownIcon
                  className="CardLikeMenuItem-chevron"
                  size={20}
                  sx={{ transform: 'rotate(-90deg)' }}
                />
              </Stack>
            </CardLikeMenuItem>
            <Divider sx={{ ml: 7, mr: 2 }} />
            <CardLikeMenuItem
              onClick={() =>
                history.push('/onboarding/access-existing-wallet/ledger')
              }
            >
              <LedgerIcon size={24} />
              <Stack className="CardLikeMenuItem-text-wrapper">
                <Typography variant="button">
                  {t('Add using Ledger')}
                </Typography>
                <ChevronRightIcon
                  className="CardLikeMenuItem-chevron"
                  size={20}
                  sx={{ transform: 'rotate(-90deg)' }}
                />
              </Stack>
            </CardLikeMenuItem>
            <Divider sx={{ ml: 7, mr: 2 }} />
            <CardLikeMenuItem
              onClick={() =>
                history.push('/onboarding/access-existing-wallet/keystone')
              }
            >
              <LedgerIcon size={24} /> {/* TODO: add keystone icon */}
              <Stack className="CardLikeMenuItem-text-wrapper">
                <Typography variant="button">
                  {t('Add using Keystone')}
                </Typography>
                <ChevronRightIcon
                  className="CardLikeMenuItem-chevron"
                  size={20}
                  sx={{ transform: 'rotate(-90deg)' }}
                />
              </Stack>
            </CardLikeMenuItem>
          </CardLikeMenu>
          <Route path="/onboarding/access-existing-wallet/recovery-phrase">
            <Stack sx={{ width: 1, flex: '0 0 auto' }}>dupson fraza</Stack>
          </Route>
          <Route path="/onboarding/access-existing-wallet/ledger">
            <Stack sx={{ width: 1, flex: '0 0 auto' }}>dupson ledger</Stack>
          </Route>
          <Route path="/onboarding/access-existing-wallet/keystone">
            <Stack sx={{ width: 1, flex: '0 0 auto' }}>dupson keystone</Stack>
          </Route>
        </Stack>
      </Stack>
    </FullscreenModal>
  );
};

const CardLikeMenu = styled(MenuList)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: getHexAlpha(
    theme.palette.mode === 'light'
      ? theme.palette.neutral[850]
      : theme.palette.common.white,
    10,
  ),
  borderRadius: theme.shape.mediumBorderRadius,
}));

const CardLikeMenuItem = styled(MenuItem)(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: theme.spacing(3),
  color: theme.palette.text.primary,

  '& .CardLikeMenuItem-chevron': {
    transform: 'translateY(0px)',
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

  '&:hover': {
    backgroundColor: 'unset',

    '.CardLikeMenuItem-text-wrapper': {
      color: theme.palette.text.secondary,
    },

    '& .CardLikeMenuItem-chevron': {
      transform: 'translateY(5px)',
    },
  },
}));
