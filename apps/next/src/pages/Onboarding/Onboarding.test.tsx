import { render } from '@testing-library/react';
import { Onboarding } from './Onboarding';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('pages/Onboarding', () => {
  it('renders', async () => {
    const { container } = render(<Onboarding />);

    expect(container.innerHTML).toContain('Welcome to new Core!');
  });
});
