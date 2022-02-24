export const displaySeconds = (timeInSeconds: number): string => {
  return timeInSeconds >= 3600
    ? new Date(timeInSeconds * 1000).toISOString().substr(11, 8) // HH:MM:SS
    : new Date(timeInSeconds * 1000).toISOString().substr(14, 5); // MM:SS
};
