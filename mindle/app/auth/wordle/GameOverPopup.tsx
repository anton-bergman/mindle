import { PlayedGame } from "@/app/database";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useWordle } from "./WordleContext";

interface TimeObject {
  hours: string;
  minutes: string;
  seconds: string;
}

interface GameOverPopupProps {
  playedGame: PlayedGame | null;
}

export default function GameOverPopup({ playedGame }: GameOverPopupProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { wordLength, endTime } = useWordle();
  //const [openPopupTrigger, setOpenPopupTrigger] = useState<boolean>(false);

  const unixToTimeObject = (unixTime: number): TimeObject => {
    const hoursUnix: number = Math.floor((unixTime / (1000 * 60 * 60)) % 24);
    const hoursFormatted: string =
      0 <= hoursUnix && hoursUnix <= 9 ? `0${hoursUnix}` : `${hoursUnix}`;

    const minutesUnix: number = Math.floor((unixTime / 1000 / 60) % 60);
    const minutesFormatted: string =
      0 <= hoursUnix && hoursUnix <= 9 ? `0${hoursUnix}` : `${hoursUnix}`;

    const secondsUnix: number = Math.floor((unixTime / 1000) % 60);
    const secondsFormatted: string =
      0 <= secondsUnix && secondsUnix <= 9
        ? `0${secondsUnix}`
        : `${secondsUnix}`;

    const time: TimeObject = {
      hours: hoursFormatted,
      minutes: minutesFormatted,
      seconds: secondsFormatted,
    };
    return time;
  };

  const calculateTimeToNextGame = (): TimeObject => {
    const now: number = Date.now();
    const midnight: number = new Date(now).setHours(24, 0, 0, 0);
    const differenceUnix: number = midnight - now;

    let timeToNextGame: TimeObject = {
      hours: "-1",
      minutes: "-1",
      seconds: "-1",
    };
    if (differenceUnix > 0) {
      timeToNextGame = unixToTimeObject(differenceUnix);
    }
    return timeToNextGame;
  };

  const [timeToNextGame, setTimeToNextGame] = useState<TimeObject>(
    calculateTimeToNextGame()
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeToNextGame(calculateTimeToNextGame());
    }, 1000);

    return () => clearTimeout(timer);
  });

  useEffect(() => {
    if (playedGame) {
      const timeSinceGameEnded: number =
        (Date.now() - playedGame.endTime) / 1000;
      if (timeSinceGameEnded < 5) {
        setTimeout(() => {
          onOpen();
        }, (wordLength + 1) * 350);
      } else {
        onOpen();
      }
    }
  }, [playedGame, onOpen, wordLength, endTime]);

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="dark">
        <ModalContent className="flex flex-col items-center justify-center">
          {(onClose) => (
            <>
              <ModalHeader>
                {playedGame?.wonGame ? <h1>You won!</h1> : <h1>You lost!</h1>}
              </ModalHeader>
              <ModalBody className="flex flex-col items-center justify-center mt-2">
                <div className="flex flex-col items-center justify-center">
                  <h1>Next Wordle</h1>
                  <p>
                    {timeToNextGame.hours}:{timeToNextGame.minutes}:
                    {timeToNextGame.seconds}
                  </p>
                </div>

                <div className="flex flex-row gap-5">
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
