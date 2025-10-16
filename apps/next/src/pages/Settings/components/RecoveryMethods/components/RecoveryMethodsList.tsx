import { Divider, EncryptedIcon } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdKey, MdOutlinePassword } from 'react-icons/md';

import { Page } from '@/components/Page/Page';
import { CardMenu, CardMenuItem } from '@/pages/Onboarding/components/CardMenu';

/** TODO: It came out that I don't need this component for seedless recovery, but I'm keeping it because it can be used later */
export const RecoveryMethodsList: FC = () => {
  const { t } = useTranslation();

  return (
    <Page
      title={t('Recovery methods')}
      contentProps={{
        alignItems: 'stretch',
        justifyContent: 'flex-start',
      }}
    >
      <CardMenu divider={<Divider sx={{ ml: 8, mr: 3 }} />}>
        <CardMenuItem
          onClick={() => {
            // TODO: Navigate to passkey setup
          }}
          icon={<MdOutlinePassword size={24} />}
          text={t('Passkey')}
          description={t(
            'Passkeys are used for quick, password-free recovery and enhanced security.',
          )}
        />
        <CardMenuItem
          onClick={() => {
            // TODO: Navigate to authenticator app setup
          }}
          icon={<EncryptedIcon size={24} />}
          text={t('Authenticator app')}
          description={t(
            'Authenticator apps generate secure, time-based codes for wallet recovery.',
          )}
        />
        <CardMenuItem
          onClick={() => {
            // TODO: Navigate to yubikey setup
          }}
          icon={<MdKey size={24} />}
          text={t('Yubikey')}
          description={t(
            'YubiKeys are physical, hardware-based protection and strong authentication.',
          )}
        />
      </CardMenu>
    </Page>
  );
};
