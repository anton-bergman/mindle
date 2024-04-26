import React, { useEffect, useState } from "react";
import { useWordle } from "./WordleContext";

interface BoxProps {
  row: number;
  col: number;
  guess: string;
  isGuessed: boolean;
  triggerFlipAnimation: boolean;
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

  function findAllIndexes(word: string, letter: string): Array<number> {
    const indexes: Array<number> = [];
    for (let i = 0; i < word.length; i++) {
      if (word[i] === letter) {
        indexes.push(i);
      }
    }
    return indexes;
  }

  const haveMatchingElements = (
    array1: Array<number>,
    array2: Array<number>
  ): boolean => {
    return array1.some((element) => array2.includes(element));
  };

  const calculateBackgroundColor = (
    word: string,
    guess: string,
    col: number,
    isGuessed: boolean
  ): string => {
    const greenColor: string = "bg-green-700";
    const yellowColor: string = "bg-yellow-500";
    const grayNotGuessedColor: string = "bg-neutral-900";
    const grayIncorrectGuessColor: string = "bg-neutral-700";

    const guessLetter = guess[col];

    if (!isGuessed) {
      return grayNotGuessedColor;
    }

    if (guessLetter === word[col]) {
      return greenColor;
    }

    if (word.includes(guessLetter)) {
      const wordIndexes = findAllIndexes(word, guessLetter);
      const guessIndexes = findAllIndexes(guess, guessLetter);

      if (haveMatchingElements(wordIndexes, guessIndexes)) {
        return grayIncorrectGuessColor;
      }

      const wordOccurrences = wordIndexes.length;
      for (let i = 0; i < guessIndexes.length; i++) {
        if (i + 1 <= wordOccurrences && col === guessIndexes[i]) {
          return yellowColor;
        }
      }
    }
    return grayIncorrectGuessColor;
  };

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
        className={`absolute w-[52px] h-[52px] flex justify-center items-center border-2 border-neutral-700 p-0.5 rounded bg-neutral-900 font-bold uppercase text-3xl text-white transition-opacity duration-0 delay-[125ms] ${
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
        className={`absolute w-[52px] h-[52px] flex justify-center items-center border-2 ${borderColor} p-0.5 rounded ${backgroundColor} font-bold uppercase text-3xl text-white transition-opacity duration-0 delay-[125ms] ${
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
