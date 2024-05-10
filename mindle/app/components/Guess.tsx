import React, { useEffect, useState } from "react";
import Box from "./Box";
import { useWordle } from "../context/WordleOrdleContext";

interface GuessProps {
  row: number;
  guess: string;
  isGuessed: boolean;
}

export default function Guess({ row, guess, isGuessed }: GuessProps) {
  const { triggerShakeAnimation, triggerFlipAnimation, wordLength } =
    useWordle();
  const [triggerStates, setTriggerStates] = useState<boolean[]>(
    Array(wordLength).fill(false)
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
        !isGuessed && guess.length > 0 && triggerShakeAnimation
          ? "animate-headShake"
          : ""
      } mb-1.5 grid gap-1.5 ${wordLength === 3 ? "grid-cols-3" : ""} 
      ${wordLength === 4 ? "grid-cols-4" : ""} 
      ${wordLength === 5 ? "grid-cols-5" : ""} 
      ${wordLength === 6 ? "grid-cols-6" : ""} 
      ${wordLength === 7 ? "grid-cols-7" : ""}
      ${wordLength === 7 ? "grid-cols-8" : ""}`}
    >
      {new Array(wordLength).fill(0).map((_, i) => {
        return (
          <Box
            key={i}
            row={row}
            col={i}
            guess={guess}
            isGuessed={isGuessed}
            triggerFlipAnimation={triggerStates[i]}
          />
        );
      })}
    </div>
  );
}
