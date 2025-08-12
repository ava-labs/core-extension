import {
  ComponentProps,
  JSXElementConstructor,
  ReactNode,
  useRef,
  useState,
} from 'react';
import { Divider, SearchInput, Stack } from '@avalabs/k2-alpine';

import type {
  Group,
  UseSearchableSelectProps,
  UseSearchableSelectReturnValues,
} from './types';
import {
  GroupAccordion as DefaultGroupAccordion,
  SearchableSelectTrigger as DefaultSearchableSelectTrigger,
  NoScrollPopoverContent,
  SearchableSelectListBox,
  SearchableSelectMenuRoot,
  SearchableSelectPopover,
} from './components';
import { useSearchableSelect } from './hooks';

type SearchableSelectOwnProps<T> = {
  label: string;
  getGroupLabel: (group: Group<T>) => string;
  renderValue: (value?: T) => ReactNode;
  renderOption: (
    option: T,
    getOptionProps: UseSearchableSelectReturnValues<T>['getOptionProps'],
  ) => ReactNode;
  /**
   * When set to true, the component will not flatten the options into a single
   * list when there is only one group.
   */
  suppressFlattening?: boolean;
  /**
   * When set to true, the component will not group the options at all.
   */
  skipGroupingEntirely?: boolean;
  searchInputProps?: Omit<ComponentProps<typeof SearchInput>, 'slotProps'>;
};
interface SearchableSelectSlots<T> {
  groupAccordion?: JSXElementConstructor<
    ComponentProps<typeof DefaultGroupAccordion>
  >;
  trigger?: JSXElementConstructor<
    ComponentProps<typeof DefaultSearchableSelectTrigger<T>>
  >;
}

type SearchableSelectProps<T> = SearchableSelectOwnProps<T> &
  Omit<UseSearchableSelectProps<T>, 'setIsOpen'> & {
    slots?: SearchableSelectSlots<T>;
  };

export function SearchableSelect<T>(props: SearchableSelectProps<T>) {
  const {
    label,
    value,
    getGroupLabel,
    renderValue,
    renderOption,
    slots,
    suppressFlattening,
    skipGroupingEntirely,
    searchInputProps,
    ...hookProps
  } = props;

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const triggerElement = useRef<HTMLDivElement | null>(null);

  const {
    setRoot,
    groupedOptions,
    getGroupHeaderProps,
    getOptionProps,
    getRootProps,
    getSearchInputProps,
    isListNarrowedDown,
  } = useSearchableSelect({
    ...hookProps,
    value,
    setIsOpen,
  });

  const {
    groupAccordion: GroupAccordion,
    trigger: SearchableSelectTrigger,
  }: SearchableSelectSlots<T> = {
    groupAccordion: DefaultGroupAccordion,
    trigger: DefaultSearchableSelectTrigger,
    ...props.slots,
  };

  return (
    <>
      <SearchableSelectTrigger
        ref={triggerElement}
        label={label}
        value={value}
        renderValue={renderValue}
        onClick={() => setIsOpen((o) => !o)}
      />
      <SearchableSelectPopover
        open={isOpen}
        onClose={() => setIsOpen(false)}
        anchorEl={triggerElement.current}
      >
        <NoScrollPopoverContent>
          <SearchableSelectMenuRoot ref={setRoot} {...getRootProps()}>
            <SearchInput
              autoFocus
              ref={searchInputRef}
              slotProps={{ htmlInput: getSearchInputProps() }}
              {...searchInputProps}
            />
            <Divider />
            <SearchableSelectListBox>
              {groupedOptions.map((group, index, { length }) => {
                // If there is only one group and it's not narrowed down via search,
                // render a flat list of options.
                if (
                  !suppressFlattening &&
                  (skipGroupingEntirely ||
                    (!isListNarrowedDown && index === 0 && length === 1))
                ) {
                  return (
                    <Stack key="sole-item" pt={1}>
                      {group.options.map((option) =>
                        renderOption(option, getOptionProps),
                      )}
                    </Stack>
                  );
                }

                return (
                  <GroupAccordion
                    key={group.id}
                    label={getGroupLabel(group)}
                    headerProps={getGroupHeaderProps(group)}
                  >
                    {group.options.map((option) =>
                      renderOption(option, getOptionProps),
                    )}
                  </GroupAccordion>
                );
              })}
            </SearchableSelectListBox>
          </SearchableSelectMenuRoot>
        </NoScrollPopoverContent>
      </SearchableSelectPopover>
    </>
  );
}
