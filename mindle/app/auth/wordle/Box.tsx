import React, { useEffect, useState } from "react";
import { useWordle } from "./WordleContext";

interface BoxProps {
  row: number;
  col: number;
  guess: string;
  isGuessed: boolean;
  triggerFlipAnimation: boolean;
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

export default function Box({
  row,
  col,
  guess,
  isGuessed,
  triggerFlipAnimation,
}: BoxProps) {
  const [isBoxFrontFacing, setIsBoxFrontFacing] = useState<boolean>(true);
  const { word, currentGuess, gameLoaded } = useWordle();

  useEffect(() => {
    if (
      isGuessed &&
      currentGuess - 1 === row &&
      (triggerFlipAnimation || gameLoaded)
    ) {
      setIsBoxFrontFacing(false);
    } else if (isGuessed && row != currentGuess - 1) {
      setIsBoxFrontFacing(false);
    }
  }, [
    currentGuess,
    gameLoaded,
    isGuessed,
    row,
    setIsBoxFrontFacing,
    triggerFlipAnimation,
  ]);

  const backgroundColor = calculateBackgroundColor(word, guess, col, isGuessed);
  const borderColor =
    backgroundColor === "bg-green-700"
      ? "border-green-700"
      : backgroundColor === "bg-yellow-500"
      ? "border-yellow-500"
      : "border-neutral-700";

  return (
    // --- WITHOUT vertical-card-flip animation on each box ---
    // <div
    //   key={`row-${row}-col${col}`}
    //   className={`flex  items-center justify-center h-14 w-14 p-0.5 border-2 ${borderColor} rounded font-bold uppercase text-3xl text-white ${backgroundColor}`}
    // >
    //   {guess[col]}
    // </div>

    // --- WITH vertical-card-flip animation on each box ---
    <div
      key={`row-${row}-col-${col}`}
      className={`${
        isGuessed && currentGuess - 1 === row && triggerFlipAnimation
          ? "animate-vflip"
          : ""
      } flex flex-col justify-center items-center w-[52px] h-[52px]`}
    >
      <div
        className={`absolute w-[52px] h-[52px] flex justify-center items-center border-2 border-neutral-700 p-0.5 rounded bg-neutral-900 font-bold uppercase text-3xl text-text_color transition-opacity duration-0 delay-[125ms] ${
          isBoxFrontFacing ? "" : "opacity-0"
        } ${
          isGuessed && currentGuess - 1 === row && triggerFlipAnimation
            ? "animate-vflip"
            : ""
        }`}
      >
        {guess[col]}
      </div>
      <div
        className={`absolute w-[52px] h-[52px] flex justify-center items-center border-2 ${borderColor} p-0.5 rounded ${backgroundColor} font-bold uppercase text-3xl text-text_color transition-opacity duration-0 delay-[125ms] ${
          !isBoxFrontFacing ? "" : "opacity-0"
        } ${
          isGuessed && currentGuess - 1 === row && triggerFlipAnimation
            ? "animate-vflip"
            : ""
        }`}
      >
        {guess[col]}
      </div>
    </div>
  );
}
