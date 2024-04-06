"use client";
import { useCallback, useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import Guess from "./Guess";
import { vocabulary } from "./vocabulary.json";
import { useWordleGame } from "./wordle";

export default function Wordle() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [triggerAnimation, setTriggerAnimation] = useState<boolean>(false);
  const [triggerFlipAnimation, setTriggerFlipAnimation] =
    useState<boolean>(false);
  const {
    wordLength,
    word,
    currentGuess,
    guesses,
    isGameWon,
    isGameOver,
    initGame,
    setCurrentGuess,
    setGuesses,
  } = useWordleGame(vocabulary);

  const handleKeyup = useCallback(
    (e: KeyboardEvent): void => {
      const submitGuess = (): void => {
        if (vocabulary.includes(guesses[currentGuess])) {
          setCurrentGuess((prev) => prev + 1);
          setTriggerFlipAnimation(true);
        } else if (guesses[currentGuess].length < wordLength) {
          // The submitted guess is not long enough
          setTriggerAnimation(true);
        } else {
          // The submitted guess is not a word in the vocabulary
          setTriggerAnimation(true);
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
    [currentGuess, guesses, setCurrentGuess, setGuesses, wordLength]
  );

  useEffect(() => {
    window.addEventListener("keyup", handleKeyup);

    return () => {
      window.removeEventListener("keyup", handleKeyup);
    };
  }, [handleKeyup]);

  useEffect(() => {
    if (triggerAnimation) {
      // The timeout must have the same duration as the animation
      const timeout = setTimeout(() => {
        setTriggerAnimation(false);
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [triggerAnimation]);

  useEffect(() => {
    if (isGameWon || isGameOver) {
      onOpen();
    }
  }, [isGameWon, isGameOver, onOpen]);

  // TODO: Card-flip animation
  useEffect(() => {
    if (triggerFlipAnimation) {
      // The timeout must have the same duration as the animation
      const timeout = setTimeout(() => {
        setTriggerFlipAnimation(false);
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [triggerFlipAnimation]);

  // TODO: Card-flip animation | FUNCTIONALITY TEST OF CARD-FLIP
  // const [isFrontFacing, setIsFrontFacing] = useState<boolean>(true);
  // const [trigger, setTrigger] = useState<boolean>(false);
  // const triggerFlip = () => {
  //   setTrigger(true);

  //   // Reset animation after a certain duration
  //   setTimeout(() => {
  //     setTrigger(false);
  //   }, 1000);
  // };
  return (
    <ProtectedRoute>
      {/* TODO: The values 65px must always equal the height of the navbar */}
      <div className="flex flex-col items-center justify-center h-[calc(100vh-65px)] bg-gray-900 text-white">
        {/* TODO: Card-flip animation | FUNCTIONALITY TEST OF CARD-FLIP */}
        {/* <div
          className={`${
            trigger ? "animate-vflip" : ""
          } flex flex-col justify-center items-center m-10 cursor-pointer`}
          onClick={() => {
            setIsFrontFacing((prev) => !prev);
            triggerFlip();
          }}
        >
          <div
            className={`absolute w-14 h-14 flex justify-center items-center border-2 border-neutral-700 p-0.5 rounded bg-neutral-900 transition-opacity duration-0 delay-[250ms] ${
              isFrontFacing ? "" : "opacity-0"
            } ${trigger ? "animate-vflip" : ""}`}
          ></div>
          <div
            className={`absolute w-14 h-14 flex justify-center items-center border-2 border-green-700 p-0.5 rounded bg-green-700 font-bold uppercase text-3xl text-white transition-opacity duration-0 delay-[250ms] ${
              !isFrontFacing ? "" : "opacity-0"
            } ${trigger ? "animate-vflip" : ""}`}
          >
            A
          </div>
        </div> */}

        <h1 className="text-4xl font-bold mb-8">Build Wordle here!</h1>
        {guesses.map((_, i) => (
          <Guess
            key={i}
            row={i}
            word={word}
            guess={guesses[i]}
            isGuessed={i < currentGuess}
            triggerAnimation={triggerAnimation}
            currentGuess={currentGuess}
            triggerGuessAnimation={triggerFlipAnimation}
          />
        ))}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="dark">
          <ModalContent className="flex flex-col items-center justify-center">
            {(onClose) => (
              <>
                <ModalHeader>
                  {isGameWon ? <h1>You won!</h1> : <h1>You lost!</h1>}
                </ModalHeader>
                <ModalBody className="flex flex-col items-center justify-center mt-2">
                  <div className="flex flex-row gap-5">
                    <Button
                      variant="light"
                      color="success"
                      onClick={() => {
                        initGame();
                        onClose();
                      }}
                    >
                      Play Again
                    </Button>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
