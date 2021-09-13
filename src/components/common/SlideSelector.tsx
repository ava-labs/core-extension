import React from 'react';
import { HorizontalFlex, Typography } from '@avalabs/react-components';
import styled from 'styled-components';
import { useState } from 'react';
import { useEffect } from 'react';

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

function SlideSelectorItem({
  label,
  onClick,
  selected,
}: {
  label: string;
  onClick(): void;
  selected: boolean;
}) {
  return (
    <ItemContainer selected={selected} onClick={onClick}>
      <Typography>{label}</Typography>
    </ItemContainer>
  );
}

export function SlideSelector({
  items,
  onChange,
}: {
  items: SelectorItem[];
  onChange(value: any): void;
}) {
  const [selectedItem, setSelectedItem] = useState<any>();

  useEffect(() => {
    items && items.length && setSelectedItem(items[0]);
  }, [items]);

  return (
    <Container>
      {items.map((item) => (
        <SlideSelectorItem
          key={item.label}
          label={item.label}
          selected={item === selectedItem}
          onClick={() => {
            setSelectedItem(item);
            onChange && onChange(item.value);
          }}
        />
      ))}
    </Container>
  );
}
