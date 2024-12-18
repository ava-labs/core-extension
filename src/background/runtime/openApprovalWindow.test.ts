import { container } from 'tsyringe';
import { openApprovalWindow } from './openApprovalWindow';

describe('src/background/runtime/openApprovalWindow', () => {
  beforeEach(() => {
    jest.spyOn(container, 'resolve');
  });

  it('requests approval via ApprovalService', async () => {
    const requestApproval = jest.fn();

    jest
      .mocked(container.resolve)
      .mockReturnValueOnce({ requestApproval } as any);

    openApprovalWindow({ id: '123' } as any, 'approval/screen');

    expect(requestApproval).toHaveBeenCalledWith(
      {
        id: '123',
        actionId: crypto.randomUUID(), // this is mocked
      },
      'approval/screen',
    );
  });
});
