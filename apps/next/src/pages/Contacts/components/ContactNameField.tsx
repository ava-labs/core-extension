import { useTranslation } from 'react-i18next';
import { NameField } from '@/components/Forms/NameField';

type ContactNameFieldProps = {
  name: string;
  setName: (name: string) => void;
  isNaming: boolean;
  setIsNaming: (isNaming: boolean) => void;
  autoFocus: boolean;
};

export const ContactNameField = ({
  name,
  setName,
  isNaming,
  setIsNaming,
  autoFocus,
}: ContactNameFieldProps) => {
  const { t } = useTranslation();
  return (
    <NameField
      name={name}
      setName={setName}
      isNaming={isNaming}
      setIsNaming={setIsNaming}
      autoFocus={autoFocus}
      prompt={t('Name this contact')}
      readOnly={false}
    />
  );
};
