import {
  FullscreenModalContent,
  FullscreenModalDescription,
  FullscreenModalTitle,
} from '@/components/FullscreenModal';
import { CardMenu, CardMenuItem } from '@/pages/Onboarding/components/CardMenu';
import { Divider, EncryptedIcon } from '@avalabs/k2-alpine';
import { MfaChoiceRequest, RecoveryMethod } from '@core/types';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdKey, MdOutlinePassword } from 'react-icons/md';

const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';
interface MfaChoicePromptProps {
  mfaChoice: MfaChoiceRequest;
  onChosen: (method: RecoveryMethod) => void;
}

const getMethodIcon = (method: RecoveryMethod) => {
  if (method.type === 'fido') {
    return method.aaguid === EMPTY_GUID ? (
      <MdKey size={24} />
    ) : (
      <MdOutlinePassword size={24} />
    );
  }
  return <EncryptedIcon size={24} />;
};

export const MfaChoicePrompt: FC<MfaChoicePromptProps> = ({
  mfaChoice,
  onChosen,
}) => {
  const { t } = useTranslation();

  if (mfaChoice.availableMethods?.length < 2) {
    return null;
  }

  return (
    <>
      <FullscreenModalTitle>
        {t(`Choose Verification Method`)}
      </FullscreenModalTitle>
      <FullscreenModalDescription>
        {t(
          'Select one of the available verification methods below to proceed.',
        )}
      </FullscreenModalDescription>
      <FullscreenModalContent>
        <CardMenu divider={<Divider variant="inset" sx={{ mr: 3 }} />}>
          {mfaChoice.availableMethods.map((method) => (
            <CardMenuItem
              key={method.type === 'fido' ? method.id : 'authenticator'}
              onClick={() => onChosen(method)}
              icon={getMethodIcon(method)}
              text={method.type === 'fido' ? method.name : t('Authenticator')}
            />
          ))}
        </CardMenu>
      </FullscreenModalContent>
    </>
  );
};
