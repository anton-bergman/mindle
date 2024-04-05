import React from "react";

interface GuessProps {
  row: number;
  word: string;
  guess: string;
  isGuessed: boolean;
}

export default function Guess({ row, word, guess, isGuessed }: GuessProps) {
  const length: number = word.length;
  return (
    <div className={`mb-4 grid grid-cols-${length} gap-1.5`}>
      {new Array(length).fill(0).map((_, i) => {
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
        );
      })}
    </div>
  );
}
