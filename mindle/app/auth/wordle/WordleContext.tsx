import {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
  SetStateAction,
  Dispatch,
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
  initGame: () => void;
  setWordLength: Dispatch<SetStateAction<number>>;
  setWord: Dispatch<SetStateAction<string>>;
  setMaxNumGuesses: Dispatch<SetStateAction<number>>;
  setCurrentGuess: Dispatch<SetStateAction<number>>;
  setGuesses: Dispatch<SetStateAction<Array<string>>>;
  setIsGameWon: Dispatch<SetStateAction<boolean>>;
  setIsGameOver: Dispatch<SetStateAction<boolean>>;
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
  initGame: () => {},
  setWordLength: () => {},
  setWord: () => {},
  setMaxNumGuesses: () => {},
  setCurrentGuess: () => {},
  setGuesses: () => {},
  setIsGameWon: () => {},
  setIsGameOver: () => {},
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
        initGame,
        setWordLength,
        setWord,
        setMaxNumGuesses,
        setCurrentGuess,
        setGuesses,
        setIsGameWon,
        setIsGameOver,
      }}
    >
      {children}
    </WordleContext.Provider>
  );
};

export const useWordle = () => {
  return useContext(WordleContext);
};
