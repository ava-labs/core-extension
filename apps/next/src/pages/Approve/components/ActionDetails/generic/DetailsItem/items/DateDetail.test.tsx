import { ThemeProvider } from '@avalabs/k2-alpine';
import { DetailItemType } from '@avalabs/vm-module-types';
import { render, screen } from '@shared/tests/test-utils';

import { DateDetail } from './DateDetail';

const toSeconds = (date: Date) => String(date.getTime() / 1000);

const renderDate = (date: Date) =>
  render(
    <ThemeProvider theme="dark">
      <DateDetail
        item={{
          label: 'Locked until',
          type: DetailItemType.DATE,
          value: toSeconds(date),
        }}
      />
    </ThemeProvider>,
  );

describe('DateDetail', () => {
  it('renders afternoon times on a 12-hour clock', () => {
    renderDate(new Date(2099, 11, 31, 16, 0));

    expect(screen.getByText('Dec 31, 2099, 04:00 PM')).toBeDefined();
  });

  it('renders midnight as 12 AM', () => {
    renderDate(new Date(2025, 0, 5, 0, 30));

    expect(screen.getByText('Jan 05, 2025, 12:30 AM')).toBeDefined();
  });
});
