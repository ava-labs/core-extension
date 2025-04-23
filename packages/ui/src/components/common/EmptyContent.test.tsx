import { render, screen } from '@src/tests/test-utils';
import { EmptyContent } from './EmptyContent';

describe('components/common/EmptyContent', () => {
  it('renders', async () => {
    render(<EmptyContent text="Some test text" />);

    expect(screen.getByTestId('empty-list-text').textContent).toEqual(
      'Some test text',
    );
  });
});
