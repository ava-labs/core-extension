import { DefiProtocol } from '@core/types';

export type DeFiSortOption =
  | 'none'
  | 'name-asc'
  | 'name-desc'
  | 'protocol-asc'
  | 'network-asc'
  | 'amount-desc';

export const DeFiSortOptions: Record<DeFiSortOption, string> = {
  none: 'None',
  'name-asc': 'Name A to Z',
  'name-desc': 'Name Z to A',
  'protocol-asc': 'Protocol',
  'network-asc': 'Network',
  'amount-desc': 'Amount',
};
type SortComparator = (a: DefiProtocol, b: DefiProtocol) => number;

const isAvalancheChain = (chainName: string | undefined): boolean => {
  return (chainName ?? '').toLowerCase().includes('avalanche');
};

const sortByName: SortComparator = (a, b) => a.name.localeCompare(b.name);

const sortByNameDesc: SortComparator = (a, b) => b.name.localeCompare(a.name);

const sortByProtocol: SortComparator = (a, b) => {
  const aGroups = a.groups
    .map((group) => group.name)
    .sort()
    .join(',');
  const bGroups = b.groups
    .map((group) => group.name)
    .sort()
    .join(',');
  return aGroups.localeCompare(bGroups);
};

const sortByNetwork: SortComparator = (a, b) => {
  const aIsAvalanche = isAvalancheChain(a.chainName);
  const bIsAvalanche = isAvalancheChain(b.chainName);

  if (aIsAvalanche && !bIsAvalanche) return -1;
  if (!aIsAvalanche && bIsAvalanche) return 1;

  return (a.chainName ?? '').localeCompare(b.chainName ?? '');
};

const sortByAmount: SortComparator = (a, b) =>
  b.totalUsdValue - a.totalUsdValue;

const sortComparators: Record<DeFiSortOption, SortComparator> = {
  none: () => 0,
  'name-asc': sortByName,
  'name-desc': sortByNameDesc,
  'protocol-asc': sortByProtocol,
  'network-asc': sortByNetwork,
  'amount-desc': sortByAmount,
};

export const sortProtocols = (
  protocols: DefiProtocol[],
  sortOption: DeFiSortOption | null,
): DefiProtocol[] => {
  if (sortOption === null || sortOption === 'none') {
    return protocols;
  }

  const comparator = sortComparators[sortOption];
  if (!comparator) {
    return protocols;
  }

  return [...protocols].sort(comparator);
};
