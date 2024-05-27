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
    <div className="flex flex-col items-center h-[calc(100vh-65px)] bg-page_background text-text_color pt-[10vh]">
      {/* TODO: Above, the values 65px must always equal the height of the navbar */}
      {guesses.map((_, i) => (
        <Guess
          key={i}
          row={i}
          guess={guesses[i]}
          isGuessed={i < currentGuess}
        />
      ))}
      <Keyboard />
      <GameOverPopup gameType="wordle" />
    </div>
  );
}
