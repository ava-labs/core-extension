export const measureDuration = (
  id?: string,
): {
  measurementId: string;
  start: () => void;
  end: () => number | undefined;
} => {
  const measurementId = id ?? crypto.randomUUID();

  const start = () => {
    performance.mark(`${measurementId}-start`);
  };

  const end = (): number | undefined => {
    try {
      const measurement = performance.measure(
        `${measurementId}-measurement`,
        `${measurementId}-start`,
      );

      performance.clearMarks(`${measurementId}-start`);
      performance.clearMeasures(`${measurementId}-measurement`);

      return measurement.duration;
    } catch {
      return undefined;
    }
  };

  return { measurementId, start, end };
};
