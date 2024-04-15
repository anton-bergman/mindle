"use client";
import { useEffect, useState } from "react";
import Guess from "./Guess";
import { useWordle } from "./WordleContext";
import Keyboard from "./Keyboard";
import { useAuth } from "@/app/context/AuthContext";
import { PlayedGame, addPlayedGame, hasPlayedToday } from "@/app/database";
import GameOverPopup from "./GameOverPopup";

export default function Wordle() {
  const { user } = useAuth();
  const {
    wordLength,
    currentGuess,
    guesses,
    isGameWon,
    isGameOver,
    startTime,
    endTime,
    handleKeyup,
  } = useWordle();
  const [playedGame, setPlayedGame] = useState<PlayedGame | null>(null);

  useEffect(() => {
    window.addEventListener("keyup", handleKeyup);

    return () => {
      window.removeEventListener("keyup", handleKeyup);
    };
  }, [handleKeyup]);

  useEffect(() => {
    const handleGameDatabaseUpdate = async () => {
      if (playedGame === null) {
        const databaseGame: PlayedGame | null = await hasPlayedToday(
          `Users/${user!.uid}`,
          "Games/wordle"
        );

        if ((isGameWon || isGameOver) && databaseGame === null) {
          const newGame: PlayedGame = {
            userId: `Users/${user!.uid}`,
            gameType: "Games/wordle",
            startTime: startTime,
            endTime: endTime,
            numberOfGuesses: currentGuess,
            wonGame: isGameWon,
          };
          const addGameToDB = async () => {
            await addPlayedGame(newGame);
          };
          addGameToDB();
          setPlayedGame(newGame);
        } else if (databaseGame) {
          setPlayedGame(databaseGame);
        }
      }
    };
    handleGameDatabaseUpdate();
  }, [
    isGameWon,
    isGameOver,
    wordLength,
    user,
    currentGuess,
    startTime,
    endTime,
    playedGame,
  ]);

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-65px)] bg-gray-900 text-white mt-0.5">
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
      <GameOverPopup playedGame={playedGame} />
    </div>
  );
}
