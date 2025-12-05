import { ReactElement, useId, useRef, useLayoutEffect } from 'react';

/**
 * Wraps an SVG icon and makes all internal IDs unique to prevent
 * SVG ID collisions when the same icon is rendered multiple times.
 */
export const UniqueIdIcon = ({ icon }: { icon: ReactElement }) => {
  const id = useId();
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const svg = ref.current?.querySelector('svg');
    if (!svg) return;

    // Collect all IDs first
    const ids = Array.from(svg.querySelectorAll('[id]')).map(
      (el) => el.getAttribute('id')!,
    );

    // Replace all IDs and their url() references in one innerHTML update
    let html = svg.innerHTML;
    ids.forEach((oldId) => {
      const newId = `${id}-${oldId}`;
      html = html.replaceAll(`id="${oldId}"`, `id="${newId}"`);
      html = html.replaceAll(`url(#${oldId})`, `url(#${newId})`);
    });
    svg.innerHTML = html;
  }, [id]);

  return (
    <span ref={ref} style={{ display: 'inline-flex' }}>
      {icon}
    </span>
  );
};
