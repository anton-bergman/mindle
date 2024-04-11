import {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { vocabulary } from "./vocabulary.json";
import useLocalStorage from "use-local-storage";

interface LocalStorageGameState {
  currentGuess: number;
  guesses: Array<string>;
  isGameWon: boolean;
  isGameOver: boolean;
  startTime: number;
  endTime: number;
}

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
  gameLoadedFromLocalStorage: boolean;
  initGame: () => void;
  handleKeyup: (e: KeyboardEvent) => void;
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
  gameLoadedFromLocalStorage: false,
  endTime: -1,
  initGame: () => {},
  handleKeyup: (e: KeyboardEvent) => {},
});

export const WordleContextProvider = ({ children }: WordleProps) => {
  const wordLength = vocabulary[0].length;
  const maxNumGuesses = 6;
  const language = "eng";

  const [word, setWord] = useState<string>("toast");
  const [currentGuess, setCurrentGuess] = useState<number>(0);
  const [guesses, setGuesses] = useState<Array<string>>(
    Array(maxNumGuesses).fill("")
  );
  const [isGameWon, setIsGameWon] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const [triggerShakeAnimation, setTriggerShakeAnimation] =
    useState<boolean>(false);
  const [triggerFlipAnimation, setTriggerFlipAnimation] =
    useState<boolean>(false);

  const [startTime, setStartTime] = useState<number>(-1);
  const [endTime, setEndTime] = useState<number>(-1);

  const [gameLoadedFromLocalStorage, setGameLoadedFromLocalStorage] =
    useState<boolean>(false);

  useEffect(() => {
    const localStorageGameState: string | null =
      localStorage.getItem("GameState");
    if (
      localStorageGameState &&
      JSON.parse(localStorageGameState).currentGuess > 0
    ) {
      const parsedGameState = JSON.parse(
        localStorageGameState
      ) as LocalStorageGameState;
      setGameLoadedFromLocalStorage(true);

      setCurrentGuess(parsedGameState.currentGuess);
      setGuesses(parsedGameState.guesses);
      setIsGameOver(parsedGameState.isGameOver);
      setIsGameWon(parsedGameState.isGameWon);
      setStartTime(parsedGameState.startTime);
      setEndTime(parsedGameState.endTime);
    }
  }, []);

  const [gameState, setGameState] = useLocalStorage<LocalStorageGameState>(
    "GameState",
    {
      currentGuess: currentGuess,
      guesses: guesses,
      isGameWon: isGameWon,
      isGameOver: isGameOver,
      startTime: startTime,
      endTime: endTime,
    }
  );

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
      setGameLoadedFromLocalStorage(false);
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
    [currentGuess, guesses, wordLength]
  );

  useEffect(() => {
    // useEffect to trigger shake animation
    if (triggerShakeAnimation) {
      // The timeout must have the same duration as the animation
      const timeout = setTimeout(() => {
        setTriggerShakeAnimation(false);
      }, 350);
      return () => clearTimeout(timeout);
    }

    // useEffect to trigger flip animation
    if (triggerFlipAnimation) {
      // The timeout must have the same duration as the animation
      const timeout = setTimeout(() => {
        setTriggerFlipAnimation(false);
      }, 350);
      return () => clearTimeout(timeout);
    }
  }, [triggerFlipAnimation, triggerShakeAnimation]);

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

  useEffect(() => {
    const gameState: LocalStorageGameState = {
      currentGuess: currentGuess,
      guesses: guesses,
      isGameWon: isGameWon,
      isGameOver: isGameOver,
      startTime: startTime,
      endTime: endTime,
    };
    setGameState(gameState);
  }, [
    currentGuess,
    endTime,
    guesses,
    isGameOver,
    isGameWon,
    setGameState,
    startTime,
  ]);

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
        gameLoadedFromLocalStorage,
        initGame,
        handleKeyup,
      }}
    >
      {children}
    </WordleContext.Provider>
  );
};

export const useWordle = () => {
  return useContext(WordleContext);
};
