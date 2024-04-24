/**
 * Converts milliseconds to a formatted time string.
 *
 * @param milliseconds - The number of milliseconds to convert.
 * @returns A string representing the time in the format HH:MM:SS, MM:SS or SS, depending on the duration.
 */
function formatMilliseconds(milliseconds: number): string {
  // Convert milliseconds to seconds
  const seconds = Math.round(milliseconds / 1000);

  // Calculate hours, minutes, and remaining seconds
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  // Format the hours, minutes, and seconds
  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

  // Construct the formatted time string
  if (hours > 0) {
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  } else if (minutes > 0) {
    return `${formattedMinutes}:${formattedSeconds}`;
  } else {
    return `${formattedSeconds}`;
  }
}

/**
 * Converts a decimal value to an integer percentage string.
 *
 * @param decimal - The decimal value to convert to a percentage. Must be between 0 and 1, inclusive.
 * @returns A string representing the percentage, rounded to the nearest integer, followed by the '%' symbol.
 * @throws {RangeError} If the input decimal value is outside the valid range [0, 1].
 */
function decimalToPercentage(decimal: number): string {
  const MIN_VALUE = 0;
  const MAX_VALUE = 1;

  // Check if the decimal value is within the valid range
  if (decimal < MIN_VALUE || decimal > MAX_VALUE) {
    throw new RangeError("Input decimal value must be between 0 and 1.");
  }

  // Multiply by 100 to convert to percentage
  const percentage = Math.round(decimal * 100);
  return `${percentage}%`;
}

export { formatMilliseconds, decimalToPercentage };
