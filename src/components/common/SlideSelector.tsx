import React from 'react';
import { HorizontalFlex, Typography } from '@avalabs/react-components';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useMemo } from 'react';

export interface SelectorItem {
  label: string;
  value: any;
}

const Container = styled(HorizontalFlex)`
  height: 40px;
  background-color: ${({ theme }) => theme.colors.grey[700]};
  align: center;
  width: 170px;
  border-radius: 20px;
`;

const ItemContainer = styled(HorizontalFlex)<{ selected: boolean }>`
  height: 100%;
  flex: 1;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  ${({ theme, selected }) =>
    selected
      ? `
    background-color: ${theme.colors.secondary};
    &:first-child {
        border-radius: 20px;
    };
    &:last-child {
        border-radius: 20px;
    };
  `
      : ''}
`;

export function SlideSelector({
  items,
  onChange,
}: {
  items: SelectorItem[];
  onChange(value: any): void;
}) {
  const [selectedItem, setSelectedItem] = useState<any>();

  useMemo(() => {
    !selectedItem && items && items.length && setSelectedItem(items[0]);
  }, [items]);

  return (
    <Container>
      {items.map((item) => (
        <ItemContainer
          selected={item?.label === selectedItem?.label}
          key={item.label}
          onClick={() => {
            setSelectedItem(item);
            onChange && onChange(item.value);
          }}
        >
          <Typography>{item.label}</Typography>
        </ItemContainer>
      ))}
    </Container>
  );
}
