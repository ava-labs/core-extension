import { readClipboardText, writeClipboardText } from './domClipboard';

describe('domClipboard', () => {
  let execCommand: jest.Mock;

  beforeEach(() => {
    execCommand = jest.fn();
    // jsdom does not implement execCommand
    (document as unknown as { execCommand: jest.Mock }).execCommand =
      execCommand;
  });

  describe('readClipboardText', () => {
    it('returns the pasted text', () => {
      execCommand.mockImplementation((command: string) => {
        if (command !== 'paste') return false;
        (document.activeElement as HTMLTextAreaElement).value = 'pasted';
        return true;
      });

      expect(readClipboardText(document)).toBe('pasted');
      expect(document.querySelector('textarea')).toBeNull();
    });

    it('returns null when paste is not permitted', () => {
      execCommand.mockReturnValue(false);

      expect(readClipboardText(document)).toBeNull();
    });

    it('returns null when paste throws', () => {
      execCommand.mockImplementation(() => {
        throw new Error('nope');
      });

      expect(readClipboardText(document)).toBeNull();
    });

    it('restores focus to the previously focused element', () => {
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.focus();
      execCommand.mockReturnValue(false);

      readClipboardText(document);

      expect(document.activeElement).toBe(input);
      input.remove();
    });
  });

  describe('writeClipboardText', () => {
    it('writes the given text through a copy event', () => {
      const setData = jest.fn();
      execCommand.mockImplementation((command: string) => {
        const event = new Event('copy', { cancelable: true }) as ClipboardEvent;
        Object.defineProperty(event, 'clipboardData', {
          value: { setData },
        });
        document.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
        return command === 'copy';
      });

      expect(writeClipboardText('', document)).toBe(true);
      expect(setData).toHaveBeenCalledWith('text/plain', '');
    });

    it('returns false when copy throws', () => {
      execCommand.mockImplementation(() => {
        throw new Error('nope');
      });

      expect(writeClipboardText('', document)).toBe(false);
    });
  });
});
