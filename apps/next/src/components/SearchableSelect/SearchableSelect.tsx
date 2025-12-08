import {
  Divider,
  getHexAlpha,
  SearchInput,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import {
  ComponentProps,
  FC,
  JSXElementConstructor,
  memo,
  ReactNode,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

import { FiAlertCircle } from 'react-icons/fi';
import {
  GroupAccordion as DefaultGroupAccordion,
  SearchableSelectTrigger as DefaultSearchableSelectTrigger,
  NoScrollPopoverContent,
  SearchableSelectListBox,
  SearchableSelectMenuRoot,
  SearchableSelectPopover,
} from './components';
import { useSearchableSelect } from './hooks';
import type {
  Group,
  UseSearchableSelectProps,
  UseSearchableSelectReturnValues,
} from './types';

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
  disabled?: boolean;
  renderChips?: ReactNode;
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

const DEFAULT_VIRTUALIZED_LIST_HEIGHT = 400;

// Type-wrapper around React.memo, as using it directly loses the generic type association.
const genericMemo: <T>(component: T) => T = memo;

export const SearchableSelect = genericMemo(function SearchableSelectComp<T>(
  props: SearchableSelectProps<T>,
) {
  const { t } = useTranslation();
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
    disabled,
    renderChips,
    ...hookProps
  } = props;

  const theme = useTheme();
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const triggerElement = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const RowRenderer: FC<ListChildComponentProps<T[]>> = ({
    index,
    data,
    style,
  }) => <div style={style}>{renderOption(data[index]!, getOptionProps)}</div>;

  return (
    <>
      <SearchableSelectTrigger
        ref={triggerElement}
        label={label}
        value={value}
        renderValue={renderValue}
        onClick={
          disabled
            ? undefined
            : () => hookProps.options.length > 0 && setIsOpen((o) => !o)
        }
      />
      <SearchableSelectPopover
        open={isOpen}
        onClose={() => setIsOpen(false)}
        anchorEl={triggerElement.current}
        slotProps={{
          paper: {
            sx: {
              marginTop: 6,
            },
          },
        }}
      >
        <NoScrollPopoverContent>
          <SearchableSelectMenuRoot ref={setRoot} {...getRootProps()}>
            <SearchInput
              autoFocus
              ref={searchInputRef}
              slotProps={{ htmlInput: getSearchInputProps() }}
              {...searchInputProps}
            />
            <Divider
              sx={{
                backgroundColor: getHexAlpha(
                  theme.palette.background.default,
                  30,
                ),
              }}
            />
            {renderChips}
            {groupedOptions.every((group) => group.options.length === 0) && (
              <Stack
                direction="row"
                px={2}
                py={1.5}
                alignItems="center"
                gap={1}
                width="100%"
                color="error.main"
              >
                <FiAlertCircle size={20} />
                <Typography variant="body2">
                  {t('No matching results')}
                </Typography>
              </Stack>
            )}
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
                    <Stack
                      key="sole-item"
                      pt={1}
                      ref={containerRef}
                      flexGrow={1}
                    >
                      <FixedSizeList
                        height={
                          containerRef.current?.clientHeight ??
                          DEFAULT_VIRTUALIZED_LIST_HEIGHT
                        }
                        itemData={group.options}
                        itemCount={group.options.length}
                        itemSize={44}
                        overscanCount={5}
                        style={{ overflow: 'auto', scrollbarWidth: 'none' }}
                        width="100%"
                      >
                        {RowRenderer}
                      </FixedSizeList>
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
});
