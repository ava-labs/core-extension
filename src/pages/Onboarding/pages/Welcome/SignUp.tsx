import {
  ClickAwayListener,
  Stack,
  Typography,
  styled,
  Button,
  ChevronDownIcon,
  Popper,
  Grow,
  MenuList,
  MenuItem,
  Divider,
  useTheme,
  ListIcon,
  KeystoneIcon,
  LedgerIcon,
} from '@avalabs/k2-components';
import { FeatureGates } from '@src/background/services/featureFlags/models';
import {
  OnboardingPhase,
  OnboardingURLs,
} from '@src/background/services/onboarding/models';
import { BrandName } from '@src/components/icons/BrandName';
import { Logo } from '@src/components/icons/Logo';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

const StyledMenuItem = styled(MenuItem)`
  color: ${({ theme }) => theme.palette.text.secondary};
  &:hover {
    color: ${({ theme }) => theme.palette.text.primary};
  }
  padding: 8px 16px;
`;

export function SignUp() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleButtonRef = useRef();
  const theme = useTheme();
  const history = useHistory();
  const { setOnboardingPhase } = useOnboardingContext();
  const { featureFlags } = useFeatureFlagContext();

  return (
    <Stack
      sx={{
        width: '322px',
        textAlign: 'center',
      }}
    >
      <Stack
        sx={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <Logo height={25} />
        <BrandName height={17} margin="0 0 0 12px" />
      </Stack>
      <Stack sx={{ mb: 8 }}>
        <Typography variant="h3">{t('Welcome!')}</Typography>
      </Stack>
      <Stack>
        <ClickAwayListener onClickAway={() => setIsMenuOpen(false)}>
          <Stack sx={{ flexDirection: 'row' }}>
            <Button
              onClick={() => setIsMenuOpen((open) => !open)}
              sx={{
                width: '100%',
                borderBottomRightRadius: 0,
                borderTopRightRadius: 0,
              }}
              data-testid="access-existing-wallet-button"
              color="secondary"
            >
              {t('Access Existing Wallet')}
              <Popper
                open={isMenuOpen}
                anchorEl={toggleButtonRef.current}
                placement="bottom-end"
                transition
                sx={{ pt: 1 }}
              >
                {({ TransitionProps }) => (
                  <Grow {...TransitionProps} timeout={250}>
                    <MenuList dense sx={{ p: 0, mb: 1, overflow: 'hidden' }}>
                      <StyledMenuItem
                        onClick={() => {
                          setOnboardingPhase(OnboardingPhase.IMPORT_WALLET);
                          history.push(OnboardingURLs.SEED_PHRASE);
                        }}
                        data-testid="access-with-seed-phrase"
                      >
                        <ListIcon size={16} sx={{ pr: 1 }} />
                        {t('Access with Seed Phrase')}
                      </StyledMenuItem>
                      <StyledMenuItem
                        onClick={() => {
                          setOnboardingPhase(OnboardingPhase.LEDGER);
                          history.push(OnboardingURLs.LEDGER);
                        }}
                        data-testid="access-with-ledger"
                      >
                        <LedgerIcon size={16} sx={{ pr: 1 }} />
                        {t('Access with Ledger')}
                      </StyledMenuItem>
                      {featureFlags[FeatureGates.KEYSTONE] && (
                        <StyledMenuItem
                          onClick={() => {
                            setOnboardingPhase(OnboardingPhase.KEYSTONE);
                            history.push(OnboardingURLs.KEYSTONE);
                          }}
                          data-testid="access-with-keystone"
                        >
                          <KeystoneIcon size={16} sx={{ pr: 1 }} />
                          {t('Access with Keystone')}
                        </StyledMenuItem>
                      )}
                    </MenuList>
                  </Grow>
                )}
              </Popper>
            </Button>
            <Button
              color="secondary"
              sx={{
                borderBottomLeftRadius: 0,
                borderTopLeftRadius: 0,
                borderLeft: `1px solid ${theme.palette.grey[800]}`,
              }}
              ref={toggleButtonRef}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <ChevronDownIcon
                size={24}
                sx={{
                  transition: 'transform ease-in-out .15s',
                  transform: isMenuOpen ? 'rotateX(180deg)' : 'none',
                }}
              />
            </Button>
          </Stack>
        </ClickAwayListener>
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            my: 2.5,
          }}
        >
          <Divider sx={{ flexGrow: 4, mr: 1.5 }} />

          <Typography>
            <Trans i18nKey="Or" />
          </Typography>

          <Divider sx={{ flexGrow: 4, ml: 1.5 }} />
        </Stack>
        <Button
          sx={{ width: '100%' }}
          data-testid="create-wallet-seed-phrase-button"
          color="secondary"
          size="large"
          endIcon={<ListIcon size={20} />}
          onClick={() => {
            history.push('/onboarding/create-wallet');
          }}
        >
          {t('Create Wallet with Seed Phrase')}
        </Button>
      </Stack>
    </Stack>
  );
}
