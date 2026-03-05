import { Stack } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

import { NavButton } from '@/pages/Onboarding/components/NavButton';
import { PendingKeystoneCircles } from '@/components/PendingCircles';

type Props = {
  onConnect: () => void;
};

export const KeystoneClickToConnectMessage = ({ onConnect }: Props) => {
  const { t } = useTranslation();

  return (
    <Stack
      width="100%"
      gap={6}
      textAlign="center"
      flexGrow={1}
      justifyContent="center"
      alignItems="center"
      maxWidth="340px"
    >
      <PendingKeystoneCircles startImmediately />
      <Stack direction="row" justifyContent="center">
        <NavButton size="medium" color="primary" onClick={onConnect}>
          {t('Connect')}
        </NavButton>
      </Stack>
    </Stack>
  );
};
