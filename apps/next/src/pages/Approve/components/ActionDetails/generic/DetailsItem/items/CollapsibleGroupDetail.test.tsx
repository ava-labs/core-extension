import { ThemeProvider } from '@avalabs/k2-alpine';
import { CollapsibleGroupItem, DetailItemType } from '@avalabs/vm-module-types';
import { NetworkWithCaipId } from '@core/types';
import { fireEvent, render, screen } from '@shared/tests/test-utils';

import { CollapsibleGroupDetail } from './CollapsibleGroupDetail';

const item: CollapsibleGroupItem = {
  type: DetailItemType.COLLAPSIBLE_GROUP,
  label: 'Transfer details',
  value: [
    {
      items: [
        {
          type: DetailItemType.TEXT,
          label: 'Asset',
          value: 'AVAX',
          alignment: 'horizontal',
        },
      ],
    },
  ],
};

const renderGroup = (isOpenByDefault?: boolean) =>
  render(
    <ThemeProvider theme="dark">
      <CollapsibleGroupDetail
        item={item}
        network={{} as NetworkWithCaipId}
        isOpenByDefault={isOpenByDefault}
      />
    </ThemeProvider>,
  );

const header = () => screen.getByRole('button', { name: 'Transfer details' });

describe('CollapsibleGroupDetail', () => {
  it('is closed by default', () => {
    renderGroup();

    expect(header().getAttribute('aria-expanded')).toBe('false');
  });

  it('opens on click', () => {
    renderGroup();

    fireEvent.click(header());

    expect(header().getAttribute('aria-expanded')).toBe('true');
  });

  it('is open from the start when open by default', () => {
    renderGroup(true);

    expect(header().getAttribute('aria-expanded')).toBe('true');
  });

  it('closes on click when open by default', () => {
    renderGroup(true);

    fireEvent.click(header());

    expect(header().getAttribute('aria-expanded')).toBe('false');
  });
});
