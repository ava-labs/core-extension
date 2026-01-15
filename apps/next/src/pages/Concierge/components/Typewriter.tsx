import { Stack } from '@avalabs/k2-alpine';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

export const Typewriter = ({
  text,
  scrollToBottom,
  typingSpeed = 10,
}: {
  text: string;
  scrollToBottom: () => void;
  typingSpeed?: number;
}) => {
  const [visibleLength, setVisibleLength] = useState(0);

  useEffect(() => {
    if (visibleLength < text.length) {
      const timer = setTimeout(() => {
        setVisibleLength(visibleLength + 1);
        scrollToBottom();
      }, typingSpeed);

      return () => clearTimeout(timer);
    } else {
      scrollToBottom();
    }
  }, [visibleLength, typingSpeed, text.length, scrollToBottom]);

  return (
    <Stack>
      <ReactMarkdown>{text.substring(0, visibleLength)}</ReactMarkdown>
    </Stack>
  );
};
