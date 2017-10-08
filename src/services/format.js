/**
 * Format a duration in seconds into the format m:ss
 * @param {Number} duration The duration in seconds
 * @return {string} The formatted duration
 */
export const formatDuration = (duration = 0) => {
  if (Number.isNaN(duration)) duration = 0;

  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};
