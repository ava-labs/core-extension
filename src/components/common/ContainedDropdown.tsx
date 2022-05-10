import { MutableRefObject, PropsWithChildren, useRef } from 'react';
import styled from 'styled-components';
import { useOnClickOutside } from '@avalabs/react-components';

const BOTTOM_PADDING = 16;

// Dropdown is absolutely positioned, and fills the viewport beneath the select element
const getDropdownHeight = (
  anchorEl: MutableRefObject<HTMLElement | null>
): number => {
  if (!anchorEl.current) return 0; // Default height
  return (
    window.visualViewport.height -
    anchorEl?.current?.getBoundingClientRect().top -
    anchorEl?.current?.offsetHeight -
    BOTTOM_PADDING
  );
};

const getOffsetTop = (anchorEl: MutableRefObject<HTMLElement | null>) =>
  anchorEl?.current
    ? anchorEl?.current?.offsetTop + anchorEl?.current?.offsetHeight
    : 0;

const Dropdown = styled.div<{
  isOpen?: boolean;
  height?: number | string;
  top?: number;
  right?: number;
  width?: string;
  margin?: string;
  borderRadius?: string;
}>`
  display: flex;
  flex-flow: column;
  position: absolute;
  overflow-y: hidden;
  width: ${({ width }) => `${width ?? '100%'}`};
  background: ${({ theme }) => theme.colors.bg1};
  z-index: 1;
  transition: height 0.15s ease, opacity 0.15s ease;
  border-radius: ${({ borderRadius }) => borderRadius ?? '0 0 8px 8px'};
  margin: ${({ margin }) => margin ?? '0'};
  height: ${({ isOpen, height }) => (isOpen ? `${height}px` : 0)};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  top: ${({ top }) => `${top}px`};
  right: ${({ right }) => `${right}px`};
  transition: height 0.15s ease, opacity 0.15s ease;
`;

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
}: PropsWithChildren<ContainedDropdownProps>) => {
  const calculatedHeight = getDropdownHeight(anchorEl);
  const top = getOffsetTop(anchorEl);
  const container = useRef(null);
  useOnClickOutside(container, () => setIsOpen(false));
  return (
    <Dropdown
      height={height || calculatedHeight}
      isOpen={isOpen}
      top={top}
      right={0}
      width={width}
      margin={margin}
      borderRadius={borderRadius}
      ref={container}
    >
      {children}
    </Dropdown>
  );
};
