// Parses a raw <input value> string into a clamped integer.
// Returns `min` when the value is missing, non-numeric, or below the floor.
export const parseIntegerInput = (raw: string, min: number) => {
  const parsed = parseInt(raw, 10);
  if (Number.isNaN(parsed) || parsed < min) {
    return min;
  }
  return parsed;
};
