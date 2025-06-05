export const measureDuration = (
  id?: string,
): {
  measurementId: string;
  start: () => void;
  end: () => number;
} => {
  const measurementId = id ?? crypto.randomUUID();

  const start = () => {
    performance.mark(`${measurementId}-start`);
  };

  const end = (): number => {
    const measurement = performance.measure(
      `${measurementId}-measurement`,
      `${measurementId}-start`,
    );

    performance.clearMarks(`${measurementId}-start`);
    performance.clearMeasures(`${measurementId}-measurement`);

    return measurement.duration;
  };

  return { measurementId, start, end };
};
