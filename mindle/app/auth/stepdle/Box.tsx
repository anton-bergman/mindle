import React, { useEffect, useState } from "react";
import { useStepdle } from "./StepdleContext";
import { calculateBackgroundColor } from "@/app/utils";

interface BoxProps {
  row: number;
  col: number;
  guess: string;
  targetWord: string;
  isGuessed: boolean;
  triggerFlipAnimation: boolean;
}

export default function Box({
  row,
  col,
  guess,
  targetWord,
  isGuessed,
  triggerFlipAnimation,
}: BoxProps) {
  const [isBoxFrontFacing, setIsBoxFrontFacing] = useState<boolean>(true);
  const { currentGuess, gameLoaded } = useStepdle();

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

  const backgroundColor = calculateBackgroundColor(
    targetWord,
    guess,
    col,
    isGuessed
  );
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
    //   className={`flex items-center justify-center h-14 w-14 p-0.5 border-2 ${borderColor} rounded font-bold uppercase text-3xl text-white ${backgroundColor}`}
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
