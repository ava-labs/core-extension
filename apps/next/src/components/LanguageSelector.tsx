import { ButtonProps, Typography } from '@avalabs/k2-alpine';
import { useAnalyticsContext, useLanguage } from '@core/ui';
import { SelectButton } from './SelectButton';

type LanguageSelectorProps = ButtonProps & {
  dataTestId: string;
  onSelectEventName: string;
};

export function LanguageSelector({
  dataTestId,
  onSelectEventName,
  ...props
}: LanguageSelectorProps) {
  const { capture } = useAnalyticsContext();
  const { availableLanguages, changeLanguage, currentLanguage } = useLanguage();

  return (
    <SelectButton
      renderValue={
        <Typography variant="subtitle2" color="text.secondary">
          {currentLanguage?.name}
        </Typography>
      }
      options={availableLanguages.map((lang) => ({
        key: lang.code,
        label: `${lang.name} (${lang.originalName})`,
        value: lang.code,
        dataTestId: `language-selector-menu-item-${lang.code}`,
        selected: lang.code === currentLanguage?.code,
        selectValue: lang.code,
      }))}
      onOptionSelect={async (langCode) => {
        await changeLanguage(langCode);
        capture(onSelectEventName, {
          language: langCode,
        });
      }}
      dataTestId={dataTestId}
      {...props}
    />
  );
}
