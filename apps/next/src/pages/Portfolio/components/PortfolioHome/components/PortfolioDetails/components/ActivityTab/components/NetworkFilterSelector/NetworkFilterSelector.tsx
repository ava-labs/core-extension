import { SearchableSelect } from '@/components/SearchableSelect';
import { Box } from '@avalabs/k2-alpine';
import { Network } from '@core/types';
import { useNetworkContext } from '@core/ui';
import { ComponentProps, FC, RefObject, useState } from 'react';
import { NetworkItem } from './components/NetworkItem';
import { NetworkLabel } from './components/NetworkLabel';
import { SelectTrigger } from './components/SelectTrigger';

type Props = {
  ref?: RefObject<HTMLElement>;
  selected: Network['chainId'];
  onChange(chainId: Network['chainId']): void;
};

type SelectProps = ComponentProps<typeof SearchableSelect<Network>>;

export const NetworkFilterSelector: FC<Props> = ({
  ref,
  selected,
  onChange,
}) => {
  const { networks } = useNetworkContext();
  const [query, setQuery] = useState<string>('');

  return (
    <Box ref={ref}>
      <SearchableSelect<Network>
        options={networks}
        label=""
        value={networks.find((n) => n.chainId === selected)}
        getGroupLabel={getGroupLabel}
        renderValue={renderValue}
        renderOption={renderOption}
        getOptionId={getOptionId}
        query={query}
        onQueryChange={setQuery}
        onValueChange={(n) => onChange(n.chainId)}
        skipGroupingEntirely
        isOptionEqualToValue={isOptionEqualToValue}
        searchFn={searchFn}
        id="network-filter-selector"
        slots={slots}
      />
    </Box>
  );
};

const slots: SelectProps['slots'] = {
  trigger: SelectTrigger,
};

const getGroupLabel: SelectProps['getGroupLabel'] = () => '';

const renderValue: SelectProps['renderValue'] = (n: Network | undefined) =>
  n ? (
    <NetworkLabel chainName={n.chainName} logoUri={n.logoUri} asSelection />
  ) : null;

const renderOption: SelectProps['renderOption'] = (network, getOptionProps) => (
  <NetworkItem
    key={getOptionId(network)}
    {...getOptionProps(network)}
    network={network}
  />
);

const getOptionId: SelectProps['getOptionId'] = ({ chainId }: Network) =>
  String(chainId);

const isOptionEqualToValue: SelectProps['isOptionEqualToValue'] = (
  n1: Network,
  n2: Network,
) => n1.chainId === n2.chainId;

const searchFn: SelectProps['searchFn'] = (option, query) => {
  if (!query) return true;
  const normalizedQuery = query.toLowerCase();
  return option.chainName.toLowerCase().includes(normalizedQuery);
};
