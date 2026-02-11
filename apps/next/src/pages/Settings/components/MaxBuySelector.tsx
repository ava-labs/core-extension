import { ButtonProps, Typography } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { MaxBuyOption } from '@core/types';
import { SelectButton } from '@/components/SelectButton';

type MaxBuySelectorProps = ButtonProps & {
  value: MaxBuyOption;
  onChange: (value: MaxBuyOption) => void;
};

const maxBuyOptions: { value: MaxBuyOption; label: string }[] = [
  { value: '1000', label: '$1,000' },
  { value: '5000', label: '$5,000' },
  { value: '10000', label: '$10,000' },
  { value: '50000', label: '$50,000' },
  { value: 'unlimited', label: 'Unlimited' },
];

export const MaxBuySelector = ({
  value,
  onChange,
  ...props
}: MaxBuySelectorProps) => {
  const { t } = useTranslation();

  const selectedOption = maxBuyOptions.find((o) => o.value === value);

  return (
    <SelectButton
      renderValue={
        <Typography variant="subtitle2" color="text.secondary">
          {selectedOption
            ? selectedOption.value === 'unlimited'
              ? t('Unlimited')
              : selectedOption.label
            : t('Select')}
        </Typography>
      }
      options={maxBuyOptions.map((option) => ({
        key: option.value,
        label: option.value === 'unlimited' ? t('Unlimited') : option.label,
        value: option.value,
        dataTestId: `max-buy-selector-${option.value}`,
        selected: option.value === value,
        selectValue: option.value,
      }))}
      onOptionSelect={async (selectValue) => {
        onChange(selectValue);
      }}
      {...props}
    />
  );
};
