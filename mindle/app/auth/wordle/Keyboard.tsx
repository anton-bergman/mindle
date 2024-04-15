import React from "react";
import { useWordle } from "./WordleContext";
import { func } from "prop-types";
import BackspaceIcon from "@mui/icons-material/Backspace";

export default function Keyboard() {
  const { word, language, guesses, currentGuess } = useWordle();
  const englishLayout: Array<string> = ["qwertyuiop", "asdfghjkl", "0zxcvbnm1"];
  const swedishLayout: Array<string> = [
    "qwertyuiopå",
    "asdfghjklöä",
    "0zxcvbnm1",
  ];
  const layout: Array<string> =
    language === "eng" ? englishLayout : swedishLayout;
  const allGuessedLetters: Array<string> = guesses
    .slice(0, currentGuess)
    .join("")
    .split("");

  const exactGuess = function (): Array<string> {
    return word.split("").filter((letter, i) => {
      return charsAtPosition(i).includes(letter);
    });
  };

  const charsAtPosition = function (i: number): Array<string> {
    return guesses.slice(0, currentGuess).map((word) => word[i]);
  };

  const inexactGuess = function (): Array<string> {
    return word.split("").filter((letter) => {
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
    <div className="mt-1">
      {layout.map((row, i) => (
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
                  className={`flex h-14 w-16 ${backgroundColor} items-center justify-center mr-1.5 rounded uppercase text-xs font-bold`}
                  onClick={() => handleClick(letter)}
                >
                  enter
                </div>
              );
            } else if (letter === "1") {
              return (
                <div
                  key={j}
                  className={`flex h-14 w-16 ${backgroundColor} items-center justify-center mr-1.5 rounded uppercase text-xs font-bold`}
                  onClick={() => handleClick(letter)}
                >
                  <BackspaceIcon></BackspaceIcon>
                </div>
              );
            } else {
              return (
                <div
                  key={j}
                  className={`flex h-14 w-11 ${backgroundColor} items-center justify-center mr-1.5 rounded uppercase text-xl font-bold`}
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
