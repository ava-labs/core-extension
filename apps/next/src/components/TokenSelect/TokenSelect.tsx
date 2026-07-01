import {
  CSSProperties,
  FC,
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Divider,
  Fade,
  getHexAlpha,
  SearchInput,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { FiAlertCircle } from 'react-icons/fi';
import { ListChildComponentProps, VariableSizeList } from 'react-window';

import { FungibleTokenBalance, getUniqueTokenId } from '@core/types';
import { useSearchableSelect } from '@/components/SearchableSelect/hooks';
import {
  NoScrollPopoverContent,
  SearchableSelectListBox,
  SearchableSelectMenuRoot,
  SearchableSelectPopover,
} from '@/components/SearchableSelect/components';

import { SearchableSelect } from '../SearchableSelect';
import {
  ChainFilterChips,
  SelectedToken,
  TokenMenuItem,
  TokenSelectPrompt,
  TokenSelectTrigger,
} from './components';
import { ChainOption } from './components/ChainFilterChips';
import { compareTokens, searchTokens } from './lib/utils';
import {
  useChainIds,
  useChainOptions,
  useFilteredTokenList,
  useIsAnyAvalancheNetwork,
} from './hooks';
import { TokenSelectProps } from './types';
import { areTokenListsEqual } from './utils';

const TOKEN_ROW_HEIGHT = 44;
const SEPARATOR_ROW_HEIGHT = 32;
const DEFAULT_LIST_HEIGHT = 400;

type InternalProps = TokenSelectProps & {
  filteredTokenList: FungibleTokenBalance[];
  chainOptions: ChainOption[];
  selectedChainId: number | 'avalanche' | null;
  setSelectedChainId: (id: number | 'avalanche' | null) => void;
  showAllNetworksChip: boolean;
};

const UnverifiedSeparator: FC<{ style: CSSProperties }> = ({ style }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Stack
      style={style}
      direction="row"
      alignItems="center"
      px={2}
      sx={{ borderTop: `1px solid ${getHexAlpha(theme.palette.divider, 50)}` }}
    >
      <Typography variant="caption" color="text.secondary">
        {t('Unverified tokens')}
      </Typography>
    </Stack>
  );
};

function TokenSelectFlat({
  id,
  tokenId,
  tokenList,
  onValueChange,
  query,
  onQueryChange,
  hint,
  disabled,
  filteredTokenList,
  chainOptions,
  selectedChainId,
  setSelectedChainId,
  showAllNetworksChip,
  selectedTokenFallback,
}: InternalProps) {
  const { t } = useTranslation();
  const selectedToken = useMemo(
    () =>
      tokenList.find((token) => getUniqueTokenId(token) === tokenId) ??
      selectedTokenFallback,
    [tokenList, tokenId, selectedTokenFallback],
  );

  return (
    <SearchableSelect<FungibleTokenBalance>
      id={id}
      disabled={disabled}
      options={filteredTokenList}
      getOptionId={getUniqueTokenId}
      groupBy={() => ''}
      getGroupLabel={() => ''}
      isOptionEqualToValue={compareTokens}
      searchFn={searchTokens}
      query={query}
      onQueryChange={onQueryChange}
      value={selectedToken}
      onValueChange={(token) => onValueChange(getUniqueTokenId(token))}
      label={t('Token')}
      skipGroupingEntirely
      searchInputProps={{}}
      slots={{ trigger: TokenSelectTrigger }}
      renderValue={(token) =>
        token ? (
          <SelectedToken token={token} hint={hint} />
        ) : (
          <TokenSelectPrompt />
        )
      }
      renderOption={(token, getOptionProps) => (
        <TokenMenuItem
          key={getUniqueTokenId(token)}
          {...getOptionProps(token)}
          token={token}
        />
      )}
      renderChips={
        chainOptions.length > 1 ? (
          <ChainFilterChips
            chainOptions={chainOptions}
            selectedChainId={selectedChainId}
            onChainSelect={setSelectedChainId}
            showAllNetworksChip={showAllNetworksChip}
          />
        ) : undefined
      }
    />
  );
}

function TokenSelectWithSeparator({
  id,
  tokenId,
  tokenList,
  onValueChange,
  query,
  onQueryChange,
  hint,
  disabled,
  onEndReached,
  filteredTokenList,
  chainOptions,
  selectedChainId,
  setSelectedChainId,
  showAllNetworksChip,
  selectedTokenFallback,
  onOpenChange,
  isLoadingTokens,
}: InternalProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const listBoxRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<VariableSizeList>(null);
  const endReachedRef = useRef(false);
  const [scrollOffset, setScrollOffset] = useState(0);

  const selectedToken = useMemo(
    () =>
      tokenList.find((token) => getUniqueTokenId(token) === tokenId) ??
      selectedTokenFallback,
    [tokenList, tokenId, selectedTokenFallback],
  );

  const {
    setRoot,
    groupedOptions,
    getOptionProps,
    getRootProps,
    getSearchInputProps,
  } = useSearchableSelect({
    id,
    options: filteredTokenList,
    value: selectedToken,
    query,
    setIsOpen,
    getOptionId: getUniqueTokenId,
    isOptionEqualToValue: compareTokens,
    onQueryChange,
    onValueChange: (token) => onValueChange(getUniqueTokenId(token)),
    searchFn: searchTokens,
  });

  const displayTokens = useMemo(() => {
    const tokens = groupedOptions[0]?.options ?? [];
    return tokens.toSorted((a, b) => {
      const aVerified = a.isVerified !== false ? 0 : 1;
      const bVerified = b.isVerified !== false ? 0 : 1;
      return aVerified - bVerified;
    });
  }, [groupedOptions]);

  const { separatorAt, totalItems } = useMemo(() => {
    const verifiedCount = displayTokens.filter(
      (token) => token.isVerified !== false,
    ).length;
    const hasUnverified = displayTokens.some(
      (token) => token.isVerified === false,
    );
    const sep = hasUnverified ? verifiedCount : -1;
    return {
      separatorAt: sep,
      totalItems: displayTokens.length + (sep >= 0 ? 1 : 0),
    };
  }, [displayTokens]);

  // Reset scroll when the search query changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: query is an intentional trigger dependency
  useLayoutEffect(() => {
    listRef.current?.scrollToItem(0, 'start');
    setScrollOffset(0);
  }, [query]);

  // Reset VariableSizeList size cache when separator position or item count changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: separatorAt & totalItems are an intentional trigger dependency
  useEffect(() => {
    listRef.current?.resetAfterIndex(0);
    // New items arrived — allow the end-reached callback to fire again.
    endReachedRef.current = false;
  }, [separatorAt, totalItems]);

  // The separator's top edge is at separatorAt * TOKEN_ROW_HEIGHT in scroll space.
  // Show the sticky label once that edge has scrolled past the top of the viewport.
  const showStickyLabel =
    separatorAt >= 0 && scrollOffset > separatorAt * TOKEN_ROW_HEIGHT;

  const getTokenAtDisplayIndex = (
    index: number,
  ): FungibleTokenBalance | null => {
    if (separatorAt >= 0) {
      if (index === separatorAt) return null;
      return displayTokens[index < separatorAt ? index : index - 1] ?? null;
    }
    return displayTokens[index] ?? null;
  };

  const getItemSize = (index: number) =>
    separatorAt >= 0 && index === separatorAt
      ? SEPARATOR_ROW_HEIGHT
      : TOKEN_ROW_HEIGHT;

  const RowRenderer: FC<ListChildComponentProps> = ({ index, style }) => {
    const token = getTokenAtDisplayIndex(index);
    if (!token) return <UnverifiedSeparator style={style} />;
    return (
      <div style={style}>
        <TokenMenuItem
          key={getUniqueTokenId(token)}
          {...getOptionProps(token)}
          token={token}
        />
      </div>
    );
  };

  const listHeight = listBoxRef.current?.clientHeight ?? DEFAULT_LIST_HEIGHT;

  return (
    <>
      <TokenSelectTrigger
        ref={triggerRef}
        label={t('Token')}
        value={selectedToken}
        renderValue={(token) =>
          token ? (
            <SelectedToken token={token} hint={hint} />
          ) : (
            <TokenSelectPrompt />
          )
        }
        data-testid={`${id}-trigger`}
        onClick={
          disabled
            ? undefined
            : () => tokenList.length > 0 && setIsOpen((o) => !o)
        }
      />
      <SearchableSelectPopover
        open={isOpen}
        onClose={() => setIsOpen(false)}
        anchorEl={triggerRef.current}
        slotProps={{
          paper: {
            sx: {
              marginTop: 6,
              width: 'calc(100vw - 50px)',
              left: '25px !important',
              ul: { paddingTop: '0 !important' },
            },
          },
        }}
      >
        <NoScrollPopoverContent>
          <SearchableSelectMenuRoot ref={setRoot} {...getRootProps()}>
            <Stack py={0.5}>
              <SearchInput
                autoFocus
                data-testid={id ? `${id}-search-input` : undefined}
                slotProps={{ htmlInput: getSearchInputProps() }}
              />
            </Stack>
            <Divider
              sx={{
                backgroundColor: getHexAlpha(
                  theme.palette.background.default,
                  30,
                ),
              }}
            />
            {chainOptions.length > 1 && (
              <ChainFilterChips
                chainOptions={chainOptions}
                selectedChainId={selectedChainId}
                onChainSelect={setSelectedChainId}
                showAllNetworksChip={showAllNetworksChip}
              />
            )}
            {displayTokens.length === 0 &&
              (isLoadingTokens ? (
                <Stack
                  direction="row"
                  px={2}
                  py={1.5}
                  alignItems="center"
                  gap={1}
                  color="text.secondary"
                >
                  <Typography variant="body2">{t('Loading tokens')}</Typography>
                </Stack>
              ) : (
                <Stack
                  direction="row"
                  px={2}
                  py={1.5}
                  alignItems="center"
                  gap={1}
                  color="error.main"
                >
                  <FiAlertCircle size={20} />
                  <Typography variant="body2">
                    {t('No matching results')}
                  </Typography>
                </Stack>
              ))}
            <SearchableSelectListBox
              sx={{ overflow: 'hidden' }}
              ref={listBoxRef}
            >
              <Stack pt={1} flexGrow={1} sx={{ position: 'relative' }}>
                <Fade in={showStickyLabel} mountOnEnter unmountOnExit>
                  <Stack
                    direction="row"
                    alignItems="center"
                    px={2}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      zIndex: 2,
                      height: SEPARATOR_ROW_HEIGHT,
                      bgcolor: 'background.paper',
                      borderBottom: `1px solid ${getHexAlpha(theme.palette.divider, 50)}`,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {t('Unverified tokens')}
                    </Typography>
                  </Stack>
                </Fade>
                <VariableSizeList
                  ref={listRef}
                  height={listHeight}
                  itemCount={totalItems}
                  itemSize={getItemSize}
                  overscanCount={5}
                  onItemsRendered={
                    onEndReached
                      ? ({ visibleStopIndex }) => {
                          if (endReachedRef.current) return;
                          if (visibleStopIndex >= totalItems - 5) {
                            endReachedRef.current = true;
                            onEndReached();
                          }
                        }
                      : undefined
                  }
                  onScroll={(() => {
                    let frameId: number | null = null;
                    let latestOffset = 0;

                    return ({ scrollOffset: offset }) => {
                      latestOffset = offset;

                      if (frameId !== null) {
                        return;
                      }

                      frameId = window.requestAnimationFrame(() => {
                        frameId = null;
                        setScrollOffset(latestOffset);
                      });
                    };
                  })()}
                  style={{ overflow: 'auto', scrollbarWidth: 'none' }}
                  width="100%"
                >
                  {RowRenderer}
                </VariableSizeList>
              </Stack>
            </SearchableSelectListBox>
          </SearchableSelectMenuRoot>
        </NoScrollPopoverContent>
      </SearchableSelectPopover>
    </>
  );
}

function TokenSelectRaw(props: TokenSelectProps) {
  const {
    tokenList,
    defaultChainId = null,
    externalChainOptions,
    onChainChange,
    selectedChainId: controlledChainId,
  } = props;
  // When `selectedChainId` is provided the chain selection is fully controlled
  // by the parent; otherwise the component owns it locally.
  const isChainControlled = controlledChainId !== undefined;
  const [internalChainId, setInternalChainId] = useState<
    number | 'avalanche' | null
  >(defaultChainId);
  const selectedChainId = isChainControlled
    ? controlledChainId
    : internalChainId;
  const isAnyAvalancheNetwork = useIsAnyAvalancheNetwork();
  const { availableChainIds, hasAvalancheNetworks } = useChainIds(
    tokenList,
    isAnyAvalancheNetwork,
  );
  const filteredTokenList = useFilteredTokenList(
    tokenList,
    selectedChainId,
    isAnyAvalancheNetwork,
  );
  const derivedChainOptions = useChainOptions(
    availableChainIds,
    hasAvalancheNetworks,
  );

  const handleChainSelect = (chainId: number | 'avalanche' | null) => {
    if (!isChainControlled) {
      setInternalChainId(chainId);
    }
    onChainChange?.(chainId);
  };

  const sharedProps: InternalProps = {
    ...props,
    filteredTokenList,
    chainOptions: externalChainOptions ?? derivedChainOptions,
    selectedChainId,
    setSelectedChainId: handleChainSelect,
    showAllNetworksChip: !externalChainOptions,
  };

  // Use the separator variant whenever scroll-to-end pagination is needed,
  // even if there are no unverified tokens (it handles onItemsRendered).
  if (props.onEndReached || tokenList.some((t) => t.isVerified === false)) {
    return <TokenSelectWithSeparator {...sharedProps} />;
  }
  return <TokenSelectFlat {...sharedProps} />;
}

export const TokenSelect = memo(TokenSelectRaw, areTokenListsEqual);
