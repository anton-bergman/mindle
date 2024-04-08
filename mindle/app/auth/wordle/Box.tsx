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
  const { word, currentGuess } = useWordle();

  useEffect(() => {
    if (isGuessed && currentGuess - 1 === row && triggerFlipAnimation) {
      setIsBoxFrontFacing(false);
    }
  }, [currentGuess, isGuessed, row, setIsBoxFrontFacing, triggerFlipAnimation]);

  useEffect(() => {
    if (word) {
      setIsBoxFrontFacing(true);
    }
  }, [word]);

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
