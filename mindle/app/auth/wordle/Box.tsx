import React, { useEffect, useState } from "react";

interface BoxProps {
  row: number;
  col: number;
  currentGuess: number;
  word: string;
  guess: string;
  isGuessed: boolean;
  triggerFlipAnimation: boolean;
}

export default function Box({
  row,
  col,
  currentGuess,
  word,
  guess,
  isGuessed,
  triggerFlipAnimation,
}: BoxProps) {
  const [isFrontFacing, setIsFrontFacing] = useState<boolean>(true);

  useEffect(() => {
    if (isGuessed && currentGuess - 1 === row && triggerFlipAnimation) {
      setIsFrontFacing(false);
    }
  }, [currentGuess, isGuessed, row, triggerFlipAnimation]);

  const backgroundColor = !isGuessed
    ? "bg-neutral-900"
    : guess[col] === word[col]
    ? "bg-green-700"
    : word.includes(guess[col])
    ? "bg-yellow-500"
    : "bg-neutral-700";

  const borderColor = !isGuessed
    ? "border-neutral-700"
    : guess[col] === word[col]
    ? "border-green-700"
    : word.includes(guess[col])
    ? "border-yellow-500"
    : "border-neutral-700";
  return (
    <div
      key={`row-${row}-col-${col}`}
      className={`${
        isGuessed && currentGuess - 1 === row && triggerFlipAnimation
          ? "animate-vflip"
          : ""
      } flex flex-col justify-center items-center m-10 cursor-pointer`}
    >
      <div
        className={`absolute w-14 h-14 flex justify-center items-center border-2 border-neutral-700 p-0.5 rounded bg-neutral-900 font-bold uppercase text-3xl text-white transition-opacity duration-0 delay-[250ms] ${
          isFrontFacing ? "" : "opacity-0"
        } ${
          isGuessed && currentGuess - 1 === row && triggerFlipAnimation
            ? "animate-vflip"
            : ""
        }`}
      >
        {guess[col]}
      </div>
      <div
        className={`absolute w-14 h-14 flex justify-center items-center border-2 ${borderColor} p-0.5 rounded ${backgroundColor} font-bold uppercase text-3xl text-white transition-opacity duration-0 delay-[250ms] ${
          !isFrontFacing ? "" : "opacity-0"
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
