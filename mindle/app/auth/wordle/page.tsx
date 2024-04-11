"use client";
import { useCallback, useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import Guess from "./Guess";
import { useWordle } from "./WordleContext";
import Keyboard from "./Keyboard";
import { useAuth } from "@/app/context/AuthContext";
import { PlayedGame, addPlayedGame, hasPlayedToday } from "@/app/database";

export default function Wordle() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    wordLength,
    currentGuess,
    guesses,
    isGameWon,
    isGameOver,
    startTime,
    endTime,
    initGame,
    handleKeyup,
  } = useWordle();
  const [playedGame, setPlayedGame] = useState<PlayedGame | null>(null);

  useEffect(() => {
    window.addEventListener("keyup", handleKeyup);

    return () => {
      window.removeEventListener("keyup", handleKeyup);
    };
  }, [handleKeyup]);

  const { user } = useAuth();
  useEffect(() => {
    if (isGameWon || isGameOver) {
      const game: PlayedGame = {
        userId: `Users/${user!.uid}`,
        gameType: "Games/wordle",
        startTime: startTime,
        endTime: endTime,
        numberOfGuesses: currentGuess,
        wonGame: isGameWon,
      };
      const addGameToDB = async () => {
        await addPlayedGame(game);
      };
      addGameToDB();

      setTimeout(() => {
        setPlayedGame(game);
      }, (wordLength + 1) * 350);
    }
  }, [
    isGameWon,
    isGameOver,
    wordLength,
    user,
    currentGuess,
    startTime,
    endTime,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const result: PlayedGame | null = await hasPlayedToday(
        `Users/${user!.uid}`,
        "Games/wordle"
      );
      setPlayedGame(result);
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (playedGame) {
      onOpen();
    }
  }, [playedGame, onOpen]);

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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="dark">
        <ModalContent className="flex flex-col items-center justify-center">
          {(onClose) => (
            <>
              <ModalHeader>
                {playedGame?.wonGame ? <h1>You won!</h1> : <h1>You lost!</h1>}
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
  );
}
