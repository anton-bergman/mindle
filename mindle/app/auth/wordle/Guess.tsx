import React, { useEffect, useState } from "react";
import Box from "./Box";

interface GuessProps {
  row: number;
  word: string;
  guess: string;
  isGuessed: boolean;
  triggerAnimation: boolean;

  currentGuess: number;
  triggerFlipAnimation: boolean;
}

export default function Guess({
  row,
  word,
  guess,
  isGuessed,
  triggerAnimation,
  currentGuess,
  triggerFlipAnimation,
}: GuessProps) {
  const [triggerStates, setTriggerStates] = useState<boolean[]>(
    Array(word.length).fill(false)
  );

  useEffect(() => {
    if (triggerFlipAnimation) {
      const timeouts = triggerStates.map((_, index) => {
        return setTimeout(() => {
          setTriggerStates((prevTriggerStates) => {
            const newTriggerStates = [...prevTriggerStates];
            newTriggerStates[index] = true;
            if (index > 0) {
              newTriggerStates[index - 1] = false;
            }
            return newTriggerStates;
          });
          console.log("triggerStates: ", triggerStates);
          console.log("index: ", index);
        }, index * 350); // Adjust this delay as needed
      });

      // Clear timeouts and reset trigger states
      // return () => {
      //   timeouts.forEach((timeout) => clearTimeout(timeout));
      //   //setTriggerStates([false, false, false, false, false]);
      // };
    }

    if (triggerStates[triggerStates.length - 1]) {
      // Set the last triggerState to false after the animation
      setTimeout(() => {
        setTriggerStates((prevTriggerStates) => {
          const newTriggerStates = [...prevTriggerStates];
          newTriggerStates[triggerStates.length - 1] = false;
          return newTriggerStates;
        });
      }, 350);
    }
  }, [triggerFlipAnimation, triggerStates]);

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
        return (
          <Box
            key={i}
            row={row}
            col={i}
            currentGuess={currentGuess}
            word={word}
            guess={guess}
            isGuessed={isGuessed}
            triggerFlipAnimation={triggerStates[i]}
          />
        );
      })}
    </div>
  );
}
