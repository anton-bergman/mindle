import {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import useLocalStorage from "use-local-storage";
import {
  PlayedGame,
  addPlayedGame,
  hasPlayedToday,
  readDailyGameData,
  readVocabulary,
} from "@/app/database";
import { useAuth } from "@/app/context/AuthContext";

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
  gameLoaded: boolean;
  initGame: () => void;
  handleKeyup: (e: KeyboardEvent) => void;
}

interface WordleProps {
  //children: string | JSX.Element | JSX.Element[] | (() => JSX.Element);
  children: ReactNode;
  gameLanguage: string;
}

const WordleContext = createContext<WordleContextType>({
  wordLength: 5,
  word: "no word",
  maxNumGuesses: 6,
  currentGuess: 0,
  guesses: Array(6).fill(""),
  isGameWon: false,
  isGameOver: false,
  language: "no language",
  triggerShakeAnimation: false,
  triggerFlipAnimation: false,
  startTime: -1,
  gameLoaded: false,
  endTime: -1,
  initGame: () => {},
  handleKeyup: () => {},
});

export const WordleContextProvider = ({
  children,
  gameLanguage,
}: WordleProps) => {
  const { user } = useAuth();
  const [vocabulary, setVocabulary] = useState<Array<string>>([""]);
  const wordLength = 5;
  const maxNumGuesses = 6;
  const language: string = gameLanguage;

  const [word, setWord] = useState<string>("");
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

  // True if game is loaded from database or localstorage, false otherwise
  const [gameLoaded, setGameLoaded] = useState<boolean>(false);

  // Function to load data from local storage
  const loadFromLocalStorage = () => {
    const localStorageGameState: string | null =
      localStorage.getItem("GameState");
    const todayUnix = new Date().setHours(0, 0, 0, 0);
    if (
      localStorageGameState &&
      JSON.parse(localStorageGameState).startTime >= todayUnix &&
      JSON.parse(localStorageGameState).currentGuess > 0
    ) {
      const parsedGameState = JSON.parse(
        localStorageGameState
      ) as LocalStorageGameState;
      setGameLoaded(true);
      setCurrentGuess(parsedGameState.currentGuess);
      setGuesses(parsedGameState.guesses);
      setIsGameOver(parsedGameState.isGameOver);
      setIsGameWon(parsedGameState.isGameWon);
      setStartTime(parsedGameState.startTime);
      setEndTime(parsedGameState.endTime);
    }
  };

  // Function to load data from database
  const loadFromDatabase = async (): Promise<PlayedGame | null> => {
    const databaseGame: PlayedGame | null = await hasPlayedToday(
      `Users/${user!.uid}`,
      "Games/wordle"
    );
    if (databaseGame) {
      let lastGuess: number = 0;
      for (let i = databaseGame.guesses.length - 1; i >= 0; i--) {
        if (databaseGame.guesses[i].length > 0) {
          lastGuess = i + 1;
          break;
        }
      }
      setGameLoaded(true);
      setCurrentGuess(lastGuess);
      setGuesses(databaseGame.guesses);
      setIsGameOver(true);
      setIsGameWon(databaseGame.wonGame);
      setStartTime(databaseGame.startTime);
      setEndTime(databaseGame.endTime);
    }
    return databaseGame;
  };

  useEffect(() => {
    loadFromLocalStorage();
    const loadVocabulary = async () => {
      const englishWords5 = await readVocabulary("/Vocabularies/englishWords5");
      const dailyWordleData = await readDailyGameData("/Games/wordle");
      setVocabulary(englishWords5.words);
      setWord(dailyWordleData.dailyWord);
    };
    loadVocabulary();
  }, []);

  useEffect(() => {
    const sync = async () => {
      const databaseGame: PlayedGame | null = await loadFromDatabase();

      if (!databaseGame && (isGameWon || isGameOver)) {
        const endTimeUnix: number = Date.now();
        setEndTime(endTimeUnix);

        const newGame: PlayedGame = {
          userId: `Users/${user!.uid}`,
          gameType: "Games/wordle",
          startTime: startTime,
          endTime: endTimeUnix,
          numberOfGuesses: currentGuess,
          word: word,
          guesses: guesses,
          wonGame: isGameWon,
        };

        await addPlayedGame(newGame);
      }
    };

    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameOver, user]);

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
      setGameLoaded(false);
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
    [currentGuess, guesses, vocabulary, wordLength]
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
    }

    if (currentGuess === maxNumGuesses) {
      setIsGameOver(true);
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
        gameLoaded,
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
