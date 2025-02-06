import type { StackProps } from '@avalabs/core-k2-components';
import { Stack, useTheme } from '@avalabs/core-k2-components';
import type { MutableRefObject, PropsWithChildren } from 'react';
import { forwardRef, useEffect, useRef } from 'react';

const BOTTOM_PADDING = 16;

// Dropdown is absolutely positioned, and fills the viewport beneath the select element
const getDropdownHeight = (
  anchorEl: MutableRefObject<HTMLElement | null>,
  containerRef?: MutableRefObject<HTMLElement | null>,
): number => {
  if (!anchorEl.current || !window.visualViewport) return 0; // Default height

  const anchorTop =
    anchorEl.current.getBoundingClientRect().top -
    anchorEl.current.offsetHeight;

  if (containerRef?.current) {
    return containerRef.current.getBoundingClientRect().bottom - anchorTop;
  }

  return window.visualViewport.height - anchorTop - BOTTOM_PADDING;
};

const getOffsetTop = (anchorEl: MutableRefObject<HTMLElement | null>) =>
  anchorEl?.current
    ? anchorEl?.current?.offsetTop + anchorEl?.current?.offsetHeight
    : 0;

const Dropdown = forwardRef<HTMLDivElement, StackProps>(
  ({ sx = {}, ...props }, ref) => (
    <Stack
      ref={ref}
      sx={{
        position: 'absolute',
        overflowY: 'hidden',
        backgroundColor: 'common.black',
        zIndex: 2,
        transition: 'height 0.15s ease, opacity 0.15s ease',
        right: 0,
        ...sx,
      }}
      {...props}
    />
  ),
);
Dropdown.displayName = 'Dropdown';

type ContainedDropdownProps = {
  anchorEl: MutableRefObject<HTMLElement | null>;
  isOpen?: boolean;
  top?: number;
  right?: number;
  width?: string;
  height?: string;
  margin?: string;
  borderRadius?: string;
  setIsOpen: (isOpen: boolean) => void;
  containerRef?: MutableRefObject<HTMLElement | null>;
};

/**
 * Wrapper for dropdown content on the browser-extension wallet.
 * Provides a full-width container spanning the space beneath the anchorEl, within the viewport.
 */
export const ContainedDropdown = ({
  anchorEl, // Ref of the element above where the dropdown should appear
  children,
  isOpen = false,
  width,
  height,
  margin,
  borderRadius,
  setIsOpen,
  containerRef,
}: PropsWithChildren<ContainedDropdownProps>) => {
  const calculatedHeight = getDropdownHeight(anchorEl, containerRef);
  const top = getOffsetTop(anchorEl);
  const container = useRef<HTMLDivElement>(null);
  const { spacing } = useTheme();

  // We need to detect the where the user clicked. If outside of the anchor (that is the button which opens the dropdown) and the list, it should close the dropdown
  // if the user click the anchor (the button) it will handle that on its own
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const anchorElementClicked = anchorEl.current?.contains(e.target as Node);
      const containerClicked = container.current?.contains(e.target as Node);
      if (!anchorElementClicked && !containerClicked) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [anchorEl, setIsOpen]);

  return (
    <Dropdown
      sx={{
        width: width ?? '100%',
        borderRadius: borderRadius ?? spacing(0, 0, 1, 1),
        margin: margin ?? '0',
        height: isOpen ? `${height || calculatedHeight - top}px` : 0,
        top,
        opacity: isOpen ? 1 : 0,
      }}
      ref={container}
    >
      {children}
    </Dropdown>
  );
};
