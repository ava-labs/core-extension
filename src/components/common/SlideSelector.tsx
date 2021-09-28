import React from 'react';
import { HorizontalFlex, Typography } from '@avalabs/react-components';
import styled from 'styled-components';
import { useState } from 'react';
import { useMemo } from 'react';

export interface SelectorItem {
  label: string;
  value: any;
}

const Container = styled(HorizontalFlex)`
  height: 40px;
  background-color: ${({ theme }) => theme.colors.grey[800]};
  align-items: center;
  border-radius: 20px;
`;

const ItemContainer = styled(HorizontalFlex)<{ selected: boolean }>`
  height: 100%;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: transparent;
  transition: background-color 0.3s ease;
  border-radius: 20px;
  padding: 0 12px;
  color: ${({ theme }) => theme.colors.grey[600]};

  ${({ theme, selected }) =>
    selected
      ? `
        background-color: ${theme.colors.primary[400]};
        color: ${theme.colors.text};
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
          <Typography wrap="nowrap" color={'inherit'}>
            {item.label}
          </Typography>
        </ItemContainer>
      ))}
    </Container>
  );
}