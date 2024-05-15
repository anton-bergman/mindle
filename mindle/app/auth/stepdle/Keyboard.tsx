import React, { useEffect, useState } from "react";
import { useStepdle } from "./StepdleContext";
import BackspaceIcon from "@mui/icons-material/Backspace";

export default function Keyboard() {
  const { words, guesses, currentGuess, currentTargetWord } = useStepdle();
  const englishLayout: Array<string> = ["qwertyuiop", "asdfghjkl", "0zxcvbnm1"];

  const getCurrentGuesses = (): Array<string> => {
    let currentGuesses;
    if (currentTargetWord.length === 7) {
      const index = guesses.indexOf(words.dailyWord6) + 1;
      currentGuesses = guesses.slice(index);
    } else if (currentTargetWord.length === 6) {
      const index = guesses.indexOf(words.dailyWord5) + 1;
      currentGuesses = guesses.slice(index);
    } else if (currentTargetWord.length === 5) {
      const index = guesses.indexOf(words.dailyWord4) + 1;
      currentGuesses = guesses.slice(index);
    } else {
      currentGuesses = guesses;
    }
    return currentGuesses;
  };

  const currentGuesses = getCurrentGuesses();
  const allGuessedLetters: Array<string> = currentGuesses
    .slice(0, currentGuesses.length + currentGuess - 20)
    .join("")
    .split("");

  const exactGuess = function (): Array<string> {
    return currentTargetWord.split("").filter((letter, i) => {
      return charsAtPosition(i).includes(letter);
    });
  };

  const charsAtPosition = function (i: number): Array<string> {
    return currentGuesses
      .slice(0, currentGuesses.length + currentGuess - 20)
      .map((word) => word[i]);
  };

  const inexactGuess = function (): Array<string> {
    return currentTargetWord.split("").filter((letter) => {
      return allGuessedLetters.includes(letter);
    });
  };

  const handleClick = function (letter: string) {
    let key = letter;
    if (letter === "0") {
      key = "Enter";
    } else if (letter === "1") {
      key = "Backspace";
    }
    const event = new KeyboardEvent("keyup", {
      key: key,
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="mt-1 w-full">
      {englishLayout.map((row, i) => (
        <div key={i} className="flex justify-center mt-0 mb-2">
          {row.split("").map((letter, j) => {
            const backgroundColor = exactGuess().includes(letter)
              ? "bg-green-700"
              : inexactGuess().includes(letter)
              ? "bg-yellow-500"
              : allGuessedLetters.includes(letter)
              ? "bg-neutral-700"
              : "bg-keyboard";
            if (letter === "0") {
              return (
                <div
                  key={j}
                  id="keyboard-enter"
                  className={`flex h-12 sm:h-14 w-14 sm:w-16 ${backgroundColor} items-center justify-center mr-1.5 rounded uppercase text-xs font-bold cursor-pointer`}
                  onClick={() => handleClick(letter)}
                >
                  enter
                </div>
              );
            } else if (letter === "1") {
              return (
                <div
                  key={j}
                  className={`flex h-12 sm:h-14 w-14 sm:w-16 ${backgroundColor} items-center justify-center mr-1.5 rounded uppercase text-xs font-bold cursor-pointer`}
                  onClick={() => handleClick(letter)}
                >
                  <BackspaceIcon></BackspaceIcon>
                </div>
              );
            } else {
              return (
                <div
                  key={j}
                  className={`flex h-12 sm:h-14 w-9 sm:w-11 ${backgroundColor} items-center justify-center mr-1.5 rounded uppercase text-xl font-bold cursor-pointer`}
                  onClick={() => handleClick(letter)}
                >
                  {letter}
                </div>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
}
