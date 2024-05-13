"use client";
import { useEffect } from "react";
import Guess from "../../components/Guess";
import { useWordle } from "../../context/WordleOrdleContext";
import Keyboard from "../../components/Keyboard";
import GameOverPopup from "../../components/GameOverPopup";

export default function Wordle() {
  const { currentGuess, guesses, handleKeyup, isGameOver } = useWordle();

  useEffect(() => {
    if (!isGameOver) {
      window.addEventListener("keyup", handleKeyup);
    }

    return () => {
      window.removeEventListener("keyup", handleKeyup);
    };
  }, [handleKeyup, isGameOver]);

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-65px)] bg-gray-900 text-text_color">
      {/* TODO: Above, the values 65px must always equal the height of the navbar */}

      {/* <h1 className="text-4xl font-bold mb-8">Build Wordle here!</h1> */}
      {guesses.map((_, i) => (
        <Guess
          key={i}
          row={i}
          guess={guesses[i]}
          isGuessed={i < currentGuess}
        />
      ))}
      <Keyboard />
      <GameOverPopup gameType="ordle" />
    </div>
  );
}
