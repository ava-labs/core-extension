import { t } from 'i18next';
import { KeyIcon, QRCodeIcon, UsbIcon } from '@avalabs/core-k2-components';

import { RecoveryMethodType } from '@core/service-worker';
import { useAnalyticsContext } from '@/contexts/AnalyticsProvider';

import { RecoveryMethod } from '../../../common/seedless/components/RecoveryMethod';

export const RecoveryMethodsList = ({
  onMethodClick,
  asCards = false,
  excludeTotp = false,
}) => {
  const { capture } = useAnalyticsContext();

  return (
    <>
      <RecoveryMethod
        asCard={asCards}
        onClick={() => {
          capture('AddPasskeyClicked');
          onMethodClick(RecoveryMethodType.Passkey);
        }}
        methodIcon={<KeyIcon size={24} sx={{ width: 28 }} />}
        methodName={t('Passkey')}
        methodDescription={t('Add a Passkey as a recovery method.')}
      />
      {!excludeTotp && (
        <RecoveryMethod
          asCard={asCards}
          onClick={() => {
            capture('AddAuthenticatorClicked');
            onMethodClick(RecoveryMethodType.Authenticator);
          }}
          methodIcon={<QRCodeIcon size={24} sx={{ width: 28 }} />}
          methodName={t('Authenticator')}
          methodDescription={t(
            'Use an authenticator app as a recovery method.',
          )}
        />
      )}
      <RecoveryMethod
        asCard={asCards}
        onClick={() => {
          capture('AddYubikeyClicked');
          onMethodClick(RecoveryMethodType.Yubikey);
        }}
        methodIcon={<UsbIcon size={24} sx={{ width: 28 }} />}
        methodName={t('Yubikey')}
        methodDescription={t('Add a Yubikey as a recovery method.')}
      />
    </>
  );
};
