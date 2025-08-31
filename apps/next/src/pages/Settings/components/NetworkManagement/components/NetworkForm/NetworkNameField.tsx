import { useTranslation } from 'react-i18next';
import { NameField } from '@/components/Forms/NameField';

type NetworkNameFieldProps = {
  name: string;
  setName: (name: string) => void;
  isNaming: boolean;
  setIsNaming: (isNaming: boolean) => void;
  autoFocus: boolean;
  error: string | undefined;
  required: boolean;
  readOnly: boolean;
};

export const NetworkNameField = ({
  name,
  setName,
  isNaming,
  setIsNaming,
  autoFocus,
  readOnly,
}: NetworkNameFieldProps) => {
  const { t } = useTranslation();

  return (
    <NameField
      name={name}
      setName={setName}
      isNaming={isNaming}
      setIsNaming={setIsNaming}
      autoFocus={autoFocus}
      prompt={t('Name this network')}
      readOnly={readOnly}
      showEditIcon={true}
    />
  );
};
