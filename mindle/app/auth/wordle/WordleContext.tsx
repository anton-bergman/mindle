import {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
  SetStateAction,
  Dispatch,
  useCallback,
} from "react";
import { vocabulary } from "./vocabulary.json";

interface WordleContextType {
  wordLength: number;
  word: string;
  maxNumGuesses: number;
  currentGuess: number;
  guesses: Array<string>;
  isGameWon: boolean;
  isGameOver: boolean;
  language: string;
  triggerShakeAnimation: boolean;
  triggerFlipAnimation: boolean;
  startTime: number;
  endTime: number;
  initGame: () => void;
  handleKeyup: (e: KeyboardEvent) => void;
  setWordLength: Dispatch<SetStateAction<number>>;
  setWord: Dispatch<SetStateAction<string>>;
  setMaxNumGuesses: Dispatch<SetStateAction<number>>;
  setCurrentGuess: Dispatch<SetStateAction<number>>;
  setGuesses: Dispatch<SetStateAction<Array<string>>>;
  setIsGameWon: Dispatch<SetStateAction<boolean>>;
  setIsGameOver: Dispatch<SetStateAction<boolean>>;
  setTriggerShakeAnimation: Dispatch<SetStateAction<boolean>>;
  setTriggerFlipAnimation: Dispatch<SetStateAction<boolean>>;
  setStartTime: Dispatch<SetStateAction<number>>;
  setEndTime: Dispatch<SetStateAction<number>>;
}

interface WordleProps {
  //children: string | JSX.Element | JSX.Element[] | (() => JSX.Element);
  children: ReactNode;
}

const WordleContext = createContext<WordleContextType>({
  wordLength: vocabulary[0].length,
  word: "toast",
  maxNumGuesses: 6,
  currentGuess: 0,
  guesses: Array(6).fill(""),
  isGameWon: false,
  isGameOver: false,
  language: "eng",
  triggerShakeAnimation: false,
  triggerFlipAnimation: false,
  startTime: -1,
  endTime: -1,
  initGame: () => {},
  handleKeyup: (e: KeyboardEvent) => {},
  setWordLength: () => {},
  setWord: () => {},
  setMaxNumGuesses: () => {},
  setCurrentGuess: () => {},
  setGuesses: () => {},
  setIsGameWon: () => {},
  setIsGameOver: () => {},
  setTriggerShakeAnimation: () => {},
  setTriggerFlipAnimation: () => {},
  setStartTime: () => {},
  setEndTime: () => {},
});

export const WordleContextProvider = ({ children }: WordleProps) => {
  const [wordLength, setWordLength] = useState<number>(vocabulary[0].length);
  const [word, setWord] = useState<string>("toast");
  const [maxNumGuesses, setMaxNumGuesses] = useState<number>(6);
  const [currentGuess, setCurrentGuess] = useState<number>(0);
  const [guesses, setGuesses] = useState<Array<string>>(
    Array(maxNumGuesses).fill("")
  );
  const [isGameWon, setIsGameWon] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const language = "eng";
  const [triggerShakeAnimation, setTriggerShakeAnimation] =
    useState<boolean>(false);
  const [triggerFlipAnimation, setTriggerFlipAnimation] =
    useState<boolean>(false);

  const [startTime, setStartTime] = useState<number>(-1);
  const [endTime, setEndTime] = useState<number>(-1);

  const initGame = () => {
    // Initialize game state
    setWord(vocabulary[Math.round(Math.random() * vocabulary.length)]);
    setCurrentGuess(0);
    setGuesses(Array(maxNumGuesses).fill(""));
    setIsGameWon(false);
    setIsGameOver(false);
  };

  const handleKeyup = useCallback(
    (e: KeyboardEvent): void => {
      const submitGuess = (): void => {
        if (vocabulary.includes(guesses[currentGuess])) {
          setCurrentGuess((prev) => prev + 1);
          setTriggerFlipAnimation(true);
        } else if (guesses[currentGuess].length < wordLength) {
          // The submitted guess is not long enough
          setTriggerShakeAnimation(true);
        } else {
          // The submitted guess is not a word in the vocabulary
          setTriggerShakeAnimation(true);
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
          let newGuesses = [...prevGuesses];
          newGuesses[currentGuess] += e.key.toLowerCase();
          return newGuesses;
        });
      }
      return;
    },
    [currentGuess, guesses, setCurrentGuess, setGuesses, wordLength]
  );

  useEffect(() => {
    // useEffect to trigger shake animation
    if (triggerShakeAnimation) {
      // The timeout must have the same duration as the animation
      const timeout = setTimeout(() => {
        setTriggerShakeAnimation(false);
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [triggerShakeAnimation]);

  useEffect(() => {
    // useEffect to trigger flip animation
    if (triggerFlipAnimation) {
      // The timeout must have the same duration as the animation
      const timeout = setTimeout(() => {
        setTriggerFlipAnimation(false);
      }, 350);
      return () => clearTimeout(timeout);
    }
  }, [triggerFlipAnimation]);

  useEffect(() => {
    if (currentGuess === 1) {
      const startTimeUnix: number = Date.now();
      setStartTime(startTimeUnix);
    }

    // Set win and lose conditions
    if (guesses[currentGuess - 1] === word) {
      setIsGameWon(true);
      setIsGameOver(true);
      const endTimeUnix: number = Date.now();
      setEndTime(endTimeUnix);
    }

    if (currentGuess === maxNumGuesses) {
      setIsGameOver(true);
      const endTimeUnix: number = Date.now();
      setEndTime(endTimeUnix);
    }
  }, [currentGuess, guesses, maxNumGuesses, word]);

  return (
    <WordleContext.Provider
      value={{
        wordLength,
        word,
        maxNumGuesses,
        currentGuess,
        guesses,
        isGameWon,
        isGameOver,
        language,
        triggerShakeAnimation,
        triggerFlipAnimation,
        startTime,
        endTime,
        initGame,
        handleKeyup,
        setWordLength,
        setWord,
        setMaxNumGuesses,
        setCurrentGuess,
        setGuesses,
        setIsGameWon,
        setIsGameOver,
        setTriggerShakeAnimation,
        setTriggerFlipAnimation,
        setStartTime,
        setEndTime,
      }}
    >
      {children}
    </WordleContext.Provider>
  );
};

export const useWordle = () => {
  return useContext(WordleContext);
};
