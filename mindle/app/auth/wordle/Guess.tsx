import React, { useEffect, useState } from "react";
import Box from "./Box";

interface GuessProps {
  row: number;
  word: string;
  guess: string;
  isGuessed: boolean;
  triggerAnimation: boolean;

  currentGuess: number;
  triggerGuessAnimation: boolean;
}

export default function Guess({
  row,
  word,
  guess,
  isGuessed,
  triggerAnimation,
  currentGuess,
  triggerGuessAnimation,
}: GuessProps) {
  return (
    <div
      className={`${
        !isGuessed && guess.length > 0 && triggerAnimation
          ? "animate-headShake"
          : ""
      } mb-4 grid gap-1.5 ${word.length === 3 ? "grid-cols-3" : ""} 
      ${word.length === 4 ? "grid-cols-4" : ""} 
      ${word.length === 5 ? "grid-cols-5" : ""} 
      ${word.length === 6 ? "grid-cols-6" : ""} 
      ${word.length === 7 ? "grid-cols-7" : ""}
      ${word.length === 7 ? "grid-cols-8" : ""}`}
    >
      {new Array(word.length).fill(0).map((_, i) => {
        const backgroundColor = !isGuessed
          ? "bg-neutral-900"
          : guess[i] === word[i]
          ? "bg-green-700"
          : word.includes(guess[i])
          ? "bg-yellow-500"
          : "bg-neutral-700";

        const borderColor = !isGuessed
          ? "border-neutral-700"
          : guess[i] === word[i]
          ? "border-green-700"
          : word.includes(guess[i])
          ? "border-yellow-500"
          : "border-neutral-700";

        return (
          <div
            key={`box-${i}-row${row}`}
            className={`flex  items-center justify-center h-14 w-14 p-0.5 border-2 ${borderColor} rounded font-bold uppercase text-3xl text-white ${backgroundColor}`}
          >
            {guess[i]}
          </div>

          // TODO: Card-flip animation
          // <Box
          //   key={i}
          //   row={row}
          //   col={i}
          //   currentGuess={currentGuess}
          //   word={word}
          //   guess={guess}
          //   isGuessed={isGuessed}
          //   triggerFlipAnimation={triggerGuessAnimation}
          // />
        );
      })}
    </div>
  );
}
