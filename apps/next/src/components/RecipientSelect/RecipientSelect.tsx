import { FC } from 'react';
import { Typography } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

import { AddressType } from '@core/types';
import { useAnalyticsContext } from '@core/ui';

import { SearchableSelect } from '@/components/SearchableSelect';

import { Recipient } from './types';
import { compareRecipients, getType, searchRecipients } from './lib/utils';
import { useGroupLabel } from './hooks/useGroupLabel';
import { SelectedRecipient } from './components/SelectedRecipient';
import { RecipientItem } from './components/RecipientItem';

type RecipientSelectProps = {
  addressType: AddressType;
  recipients: Recipient[];
  value?: Recipient;
  onValueChange: (recipient: Recipient) => void;
  query?: string;
  onQueryChange: (query: string) => void;
};

export const RecipientSelect: FC<RecipientSelectProps> = ({
  addressType,
  recipients,
  value,
  onValueChange,
  query,
  onQueryChange,
}) => {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();

  const getGroupLabel = useGroupLabel();

  return (
    <SearchableSelect<Recipient>
      id="recipient-select"
      options={recipients}
      getOptionId={(r) => r.id}
      groupBy={getType}
      getGroupLabel={getGroupLabel}
      isOptionEqualToValue={compareRecipients}
      searchFn={searchRecipients(addressType)}
      query={query}
      onQueryChange={onQueryChange}
      value={value}
      onValueChange={(recipient) => {
        if (recipient && getType(recipient) === 'contact') {
          capture('SendContactSelected', { contactSource: 'contacts' });
        }
        onValueChange(recipient);
      }}
      label={t('Send to')}
      renderValue={(val) =>
        val ? (
          <SelectedRecipient recipient={val} addressType={addressType} />
        ) : (
          <Typography variant="caption" color="text.secondary">
            {t('Contact or paste address')}
          </Typography>
        )
      }
      renderOption={(option, getOptionProps) => (
        <RecipientItem
          {...getOptionProps(option)}
          key={option.id}
          recipient={option}
          addressType={addressType}
        />
      )}
      searchInputProps={{
        placeholder: t('Paste address or search'),
      }}
      suppressFlattening
      skipHeaderForGroups={['unknown']}
    />
  );
};
