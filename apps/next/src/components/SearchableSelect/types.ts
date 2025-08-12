import { HTMLAttributes } from 'react';

export type Group<T> = {
  id: string;
  options: T[];
};

export type RootProps = HTMLAttributes<HTMLElement>;
export type SearchInputProps = HTMLAttributes<HTMLInputElement>;
export type GroupHeaderProps = HTMLAttributes<HTMLElement> & {
  'data-group-id': string;
};
export type OptionProps = HTMLAttributes<HTMLElement> & {
  'data-option-id': string;
  isSelected: boolean;
};

export type UseSearchableSelectProps<T> = {
  id: string;
  options: T[];
  value?: T;
  query?: string;
  setIsOpen: (isOpen: boolean) => void;
  getOptionId: (option: T) => string;
  isOptionEqualToValue: (option: T, value: T) => boolean;
  onQueryChange: (query: string) => void;
  onValueChange: (value: T) => void;
  searchFn: (option: T, query?: string) => boolean;
  groupBy?: (option: T) => string;
};

export type UseSearchableSelectReturnValues<T> = {
  isListNarrowedDown: boolean;
  setRoot: (root: HTMLDivElement) => void;
  groupedOptions: Group<T>[];
  getOptionProps: (option: T) => OptionProps;
  getGroupHeaderProps: (group: Group<T>) => GroupHeaderProps;
  getRootProps: () => RootProps;
  getSearchInputProps: () => SearchInputProps;
};
