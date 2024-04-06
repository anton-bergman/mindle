import { useState, useEffect } from "react";

export const useWordleGame = (vocabulary: string[]) => {
  const maxNumGuesses = 6;
  const wordLength = vocabulary[0].length;
  // const [word, setWord] = useState<string>(
  //   vocabulary[Math.round(Math.random() * vocabulary.length)]
  // );
  const [word, setWord] = useState<string>("toast");
  const [currentGuess, setCurrentGuess] = useState<number>(0);
  const [guesses, setGuesses] = useState<Array<string>>(
    Array(maxNumGuesses).fill("")
  );
  const [isGameWon, setIsGameWon] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const initGame = () => {
    // Initialize game state
    setWord(vocabulary[Math.round(Math.random() * vocabulary.length)]);
    setCurrentGuess(0);
    setGuesses(Array(maxNumGuesses).fill(""));
    setIsGameWon(false);
    setIsGameOver(false);
  };

  useEffect(() => {
    // Set win and lose conditions

    if (guesses[currentGuess - 1] === word) {
      setIsGameWon(true);
      setIsGameOver(true);
    }

    if (currentGuess === maxNumGuesses) {
      setIsGameOver(true);
    }
  }, [currentGuess, guesses, word]);

  return {
    maxNumGuesses,
    wordLength,
    word,
    currentGuess,
    guesses,
    isGameWon,
    isGameOver,
    initGame,
    setCurrentGuess,
    setGuesses,
    setIsGameWon,
    setIsGameOver,
  };
};
