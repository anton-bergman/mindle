/**
 * Converts milliseconds to a formatted time string.
 *
 * @param milliseconds - The number of milliseconds to convert.
 * @returns A string representing the time in the format HH:MM:SS or MM:SS, depending on the duration.
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
  } else {
    return `${formattedMinutes}:${formattedSeconds}`;
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

/**
 * Calculates the background color for a letter.
 *
 * @param {string} targetWord - The word to be guessed.
 * @param {string} guess - The player's guess.
 * @param {number} index - The index of the letter in the guess.
 * @param {boolean} isGuessed - Indicates whether the word has been fully guessed.
 * @returns {string} - The background color for the letter tile.
 */
function calculateBackgroundColor(
  targetWord: string,
  guess: string,
  index: number,
  isGuessed: boolean
): string {
  // Define CSS class names for colors
  const greenColor: string = "bg-green-700";
  const yellowColor: string = "bg-yellow-500";
  const grayNotGuessedColor: string = "bg-neutral-900";
  const grayIncorrectGuessColor: string = "bg-neutral-700";

  // If the word has not been guessed, return the gray color for unguessed letters
  if (!isGuessed) {
    return grayNotGuessedColor;
  }

  // Initialize an array to hold background colors for each letter tile
  let colors = Array(targetWord.length).fill(grayIncorrectGuessColor);

  // Iterate over each letter in the guess
  for (var i = 0; i < targetWord.length; ++i) {
    // If the guessed letter matches the target letter at the same index, set background color to green
    if (targetWord[i] === guess[i]) {
      colors[i] = greenColor;
    }
    // If the guessed letter exists in the target word but is in the wrong position, set background color to yellow
    else if (targetWord.includes(guess[i])) {
      colors[i] = yellowColor;
    }
  }

  // Iterate over each letter in the guess again
  for (var i = 0; i < targetWord.length; ++i) {
    // If the color of the letter tile is yellow, indicating a correct letter in the wrong position
    if (colors[i] == yellowColor) {
      // Calculate the maximum count of yellow tiles for this letter in the target word
      const letter = guess[i];
      const targetCount = targetWord
        .split("")
        .filter((ch) => ch == letter).length;
      const greenCount = Array.from(Array(targetWord.length).keys()).filter(
        (j) => guess[j] === letter && colors[j] === greenColor
      ).length;
      const maxYellowCount = targetCount - greenCount;

      // Count the current number of yellow tiles for this letter
      let currentYellowCount = 0;
      for (var j = 0; j < i; ++j) {
        if (guess[j] == letter && colors[j] === yellowColor) {
          currentYellowCount += 1;
        }
      }

      // If the current count of yellow tiles reaches the maximum allowed, change the color to incorrect gray
      if (currentYellowCount == maxYellowCount) {
        colors[i] = grayIncorrectGuessColor;
      }
    }
  }

  // Return the background color for the letter tile at the specified index
  return colors[index];
}

export { formatMilliseconds, decimalToPercentage, calculateBackgroundColor };
