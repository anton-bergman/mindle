"use client";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useStepdle } from "./StepdleContext";
import Guess from "./Guess";
import Keyboard from "./Keyboard";
import GameOverPopup from "./GameOverPopup";

export default function Stepdle() {
  const {
    isGameOver,
    handleKeyup,
    guesses,
    currentGuess,
    getTargetWordFromGuesses,
    words,
    currentTargetWord,
    maxNumGuesses,
  } = useStepdle();

  useEffect(() => {
    if (!isGameOver) {
      window.addEventListener("keyup", handleKeyup);
    }

    return () => {
      window.removeEventListener("keyup", handleKeyup);
    };
  }, [handleKeyup, isGameOver]);

  const scrollableRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scrollDown = () => {
      if (scrollableRef.current) {
        scrollableRef.current.scrollTo({
          top: scrollableRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    };

    const scrollDelay = setTimeout(() => {
      scrollDown();
    }, 350 * currentTargetWord.length);

    const handleKeyPress = () => {
      scrollDown();
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => {
      clearTimeout(scrollDelay);
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [currentGuess, currentTargetWord.length]);

  return (
    <div className="flex flex-col items-center h-[calc(100vh-65px)] bg-gray-900 text-text_color pt-3">
      <p className="text-xl font-semibold mb-3">
        Steps Left: {maxNumGuesses - currentGuess}
      </p>
      <div
        className="relative justify-center sm:h-[450px] h-[300px] border overflow-auto mb-4 px-4"
        ref={scrollableRef}
      >
        <div className="flex flex-col items-center">
          {guesses.map((_, i) => {
            const prevGuess = guesses[i - 1];
            const guess: string = guesses[i];

            if (i <= currentGuess && prevGuess != words.dailyWord7) {
              const subsetOfGuesses = guesses.slice(0, i);
              const targetWord: string =
                getTargetWordFromGuesses(subsetOfGuesses);

              return (
                <Guess
                  key={i}
                  row={i}
                  guess={guess}
                  targetWord={targetWord}
                  isGuessed={i < currentGuess}
                />
              );
            }
          })}
        </div>
      </div>
      <Keyboard />
      <GameOverPopup />
    </div>
  );
}
