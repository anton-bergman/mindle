"use client";
import { useCallback, useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { Button } from "@nextui-org/react";
import Guess from "./Guess";
import { vocabulary } from "./vocabulary.json";

export default function Wordle() {
  const wordLength = 5;
  //const word = vocabulary[Math.round(Math.random() * vocabulary.length)];
  //const word = "toast";
  const [word, setWord] = useState<string>("toast");
  const maxNumGuesses = 6;
  const [currentGuess, setCurrentGuess] = useState<number>(0);
  const [guesses, setGuesses] = useState<Array<string>>(
    Array(maxNumGuesses).fill("")
  );
  const [isGameWon, setIsGameWon] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const initGame = () => {
    setWord(vocabulary[Math.round(Math.random() * vocabulary.length)]);
    setCurrentGuess(0);
    setGuesses(Array(maxNumGuesses).fill(""));
    setIsGameWon(false);
    setIsGameOver(false);
  };

  const handleKeyup = useCallback(
    (e: KeyboardEvent): void => {
      const submitGuess = (): void => {
        if (vocabulary.includes(guesses[currentGuess])) {
          setCurrentGuess((prev) => prev + 1);
        }
      };

      if (e.key === "Enter") {
        submitGuess();
        return;
      } else if (e.key === "Backspace") {
        setGuesses((prevGuesses) => {
          const newGuesses = [...prevGuesses];
          newGuesses[currentGuess] = newGuesses[currentGuess].slice(0, -1);
          return newGuesses;
        });
        return;
      } else if (
        currentGuess < guesses.length &&
        guesses[currentGuess].length < wordLength &&
        e.key.match(/^[A-z]$/)
      ) {
        setGuesses((prevGuesses) => {
          const newGuesses = [...prevGuesses];
          newGuesses[currentGuess] += e.key.toLowerCase();
          return newGuesses;
        });
      }
      return;
    },
    [currentGuess, guesses]
  );

  // const allGuesses = (): string[] => {
  //   return guesses.slice(0, currentGuess).join("").split("");
  // };

  // const exactGuesses = (): string[] => {
  //   return word.split("").filter((letter, i) =>
  //     guesses
  //       .slice(0, currentGuess)
  //       .map((word) => word[i])
  //       .includes(letter)
  //   );
  // };

  // const inexactGuesses = (): string[] => {
  //   return word.split("").filter((letter) => allGuesses().includes(letter));
  // };

  useEffect(() => {
    window.addEventListener("keyup", handleKeyup);

    return () => {
      window.removeEventListener("keyup", handleKeyup);
    };
  }, [handleKeyup]);

  useEffect(() => {
    if (guesses[currentGuess - 1] === word) {
      setIsGameWon(true);
    }

    if (currentGuess === maxNumGuesses) {
      setIsGameOver(true);
    }
  }, [currentGuess, guesses, word]);

  useEffect(() => {
    if (isGameWon) {
      console.log("isGameWon: ", isGameWon);
    }

    if (isGameOver) {
      console.log("isGameOver: ", isGameOver);
    }
  }, [isGameOver, isGameWon]);

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-8">Build Wordle here!</h1>

        {guesses.map((_, i) => (
          <Guess
            key={i}
            row={i}
            word={word}
            guess={guesses[i]}
            isGuessed={i < currentGuess}
          />
        ))}
        {isGameWon && <h1>You won!</h1>}
        {isGameOver && <h1>You lost!</h1>}
        {(isGameWon || isGameOver) && (
          <Button onClick={initGame}>Play Again</Button>
        )}
      </div>
    </ProtectedRoute>
  );
}
