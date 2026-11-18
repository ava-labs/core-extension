/**
 * Clipboard access through `document.execCommand`, which (unlike
 * `navigator.clipboard`) works in documents that do not have focus, such as the
 * extension's offscreen document.
 *
 * Reading requires the `clipboardRead` permission. Without it `paste` is a
 * no-op that returns `false`, which is reported as `null` (unreadable) here
 * rather than prompting the user.
 *
 * The document is passed in explicitly so this shared package does not need
 * access to the `document` global (LavaMoat policy).
 */
export const readClipboardText = (doc: Document): string | null => {
  const textarea = doc.createElement('textarea');
  textarea.setAttribute('aria-hidden', 'true');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';

  const previouslyFocused = doc.activeElement as HTMLElement | null;
  doc.body.appendChild(textarea);
  try {
    textarea.focus();
    const pasted = doc.execCommand('paste');
    return pasted ? textarea.value : null;
  } catch {
    return null;
  } finally {
    textarea.remove();
    previouslyFocused?.focus?.();
  }
};

/**
 * Replaces the clipboard's text content. Returns whether the copy command ran.
 */
export const writeClipboardText = (text: string, doc: Document): boolean => {
  const onCopy = (event: ClipboardEvent) => {
    event.clipboardData?.setData('text/plain', text);
    event.preventDefault();
  };

  doc.addEventListener('copy', onCopy);
  try {
    return doc.execCommand('copy');
  } catch {
    return false;
  } finally {
    doc.removeEventListener('copy', onCopy);
  }
};
