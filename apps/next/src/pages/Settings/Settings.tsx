import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ChevronRightIcon,
  Stack,
  Switch,
  Typography,
} from '@avalabs/k2-alpine';

import { useContactsContext, useSettingsContext } from '@core/ui';

import {
  BUG_BOUNTIES_URL,
  CORE_FEATURE_REQUEST_URL,
  CORE_FEEDBACK_URL,
  CORE_SUPPORT_URL,
  CORE_WEB_BASE_URL,
} from '@/config';
import { Page } from '@/components/Page';
import { SwitchCard } from '@/components/SwitchCard';
import { LanguageSelector } from '@/components/LanguageSelector';

import {
  AvatarButton,
  SettingsNavItem,
  SettingsCard,
  Footer,
} from './components';
import { getContactsPath } from '@/config/routes';

export const Settings = () => {
  const { t } = useTranslation();
  const { lockWallet } = useSettingsContext();
  const { contacts } = useContactsContext();

  const [isTestnetMode, setIsTestnetMode] = useState(false);
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [isCoreAiEnabled, setIsCoreAiEnabled] = useState(false);

  return (
    <Page
      title={t('Settings')}
      description={t(
        'Manage and customize your Core experience to your liking.',
      )}
      withBackButton
    >
      <Stack direction="row" justifyContent="space-between" gap={1.5}>
        <SwitchCard
          checked={isTestnetMode}
          onChange={() => setIsTestnetMode((is) => !is)}
          title={t('Testnet mode')}
          description={t(
            'Enable a sandbox environment for testing without using real funds',
          )}
        />
        <SwitchCard
          checked={isPrivacyMode}
          onChange={() => setIsPrivacyMode((is) => !is)}
          title={t('Privacy mode')}
          description={t(
            'Hide your wallet balance on the portfolio screen for added privacy',
          )}
        />
      </Stack>
      <SettingsCard
        title={t('General')}
        description={t(
          'Tweak and customize interface elements and display settings.',
        )}
      >
        <SettingsNavItem
          label={t('My avatar')}
          secondaryAction={
            <AvatarButton onClick={() => alert('Implement avatar selection')} />
          }
          divider
        />
        <SettingsNavItem
          divider
          label={t('Currency')}
          secondaryAction={<ChevronRightIcon size={16} />}
        />
        <SettingsNavItem
          divider
          label={t('Language')}
          secondaryAction={
            <LanguageSelector
              sx={{ px: 1, mr: -0.5, gap: 0, color: 'text.secondary' }}
            />
          }
        />
        <SettingsNavItem label={t('Theme')} divider />
        <SettingsNavItem label={t('View preference')} />
      </SettingsCard>
      <SwitchCard
        title={t('Core Concierge')}
        // TODO: unify typography, remove fontSize & fontWeight
        titleProps={{
          variant: 'h3',
          fontSize: 18,
          fontWeight: '700 !important',
        }}
        orientation="horizontal"
        description={t(
          'Get Core to work for you. Whether it’s transferring, sending crypto, just ask away!',
        )}
        checked={isCoreAiEnabled}
        onChange={() => setIsCoreAiEnabled((is) => !is)}
      />
      <SettingsCard
        title={t('Privacy and security')}
        description={t(
          'Protect your data and ensure the highest level of security for your Core wallet.',
        )}
      >
        <SettingsNavItem label={t('Connected sites')} divider />
        <SettingsNavItem label={t('Change password')} divider />
        <SettingsNavItem label={t('Show recovery phrase')} divider />
        <SettingsNavItem label={t('Reset recovery phrase')} divider />
        <SettingsNavItem label={t('Recovery methods')} divider />
        <SettingsNavItem
          label={t('Participate in Core Analytics')}
          description={t(
            'Core Analytics will collect anonymous interaction data. Core is committed to protecting your privacy. We will never sell or share your data.',
          )}
          secondaryAction={<Switch size="small" />}
        />
      </SettingsCard>
      <SettingsCard title={t('Contacts')}>
        <SettingsNavItem
          label={t('Saved addresses')}
          href={getContactsPath('list')}
          secondaryAction={
            <Stack direction="row" gap={0.5} alignItems="center">
              <Typography variant="body3" color="text.secondary">
                {contacts.length}
              </Typography>
              <ChevronRightIcon size={20} />
            </Stack>
          }
        />
      </SettingsCard>
      <SettingsCard title={t('About & support')}>
        <SettingsNavItem
          label={t('Core.app')}
          href={CORE_WEB_BASE_URL}
          divider
        />
        <SettingsNavItem
          label={t('Bug bounties')}
          href={BUG_BOUNTIES_URL}
          divider
        />
        <SettingsNavItem
          label={t('Request a feature')}
          href={CORE_FEATURE_REQUEST_URL}
          divider
        />
        <SettingsNavItem
          label={t('Send feedback')}
          href={CORE_FEEDBACK_URL}
          divider
        />
        <SettingsNavItem label={t('Help center')} href={CORE_SUPPORT_URL} />
      </SettingsCard>
      <Button
        size="small"
        variant="contained"
        color="secondary"
        onClick={lockWallet}
      >
        {t('Lock Core')}
      </Button>
      <Footer mt={4} />
    </Page>
  );
};
