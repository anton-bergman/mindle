import {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import useLocalStorage from "use-local-storage";
import { useAuth } from "@/app/context/AuthContext";
import { Vocabulary } from "@/app/api/interfaces";

interface LocalStorageGameState {
  currentGuess: number;
  guesses: Array<string>;
  isGameWon: boolean;
  isGameOver: boolean;
  startTime: number;
  endTime: number;
}

interface DailyStepdleData {
  dailyWord4: string;
  dailyWord5: string;
  dailyWord6: string;
  dailyWord7: string;
  // previousWords: Array<string>;
}

interface PlayedStepdleGame {
  userId: string;
  gameType: string;
  startTime: number;
  endTime: number;
  guesses: Array<string>;
  numberOfGuesses: number;
  words: Array<string>;
  wonGame: boolean;
}

interface StepdleContextType {
  wordLength: number;
  currentTargetWord: string;
  words: DailyStepdleData;
  maxNumGuesses: number;
  currentGuess: number;
  guesses: Array<string>;
  isGameWon: boolean;
  isGameOver: boolean;
  triggerShakeAnimation: boolean;
  triggerFlipAnimation: boolean;
  startTime: number;
  endTime: number;
  gameLoaded: boolean;
  handleKeyup: (e: KeyboardEvent) => void;
  getTargetWordFromGuesses: (guesses: Array<string>) => string;
}

interface StepdleProps {
  children: ReactNode;
}

const StepdleContext = createContext<StepdleContextType>({
  wordLength: 4,
  currentTargetWord: "no word",
  words: {
    dailyWord4: "no word",
    dailyWord5: "no word",
    dailyWord6: "no word",
    dailyWord7: "no word",
  },
  maxNumGuesses: 20,
  currentGuess: 0,
  guesses: Array(20).fill(""),
  isGameWon: false,
  isGameOver: false,
  triggerShakeAnimation: false,
  triggerFlipAnimation: false,
  startTime: -1,
  gameLoaded: false,
  endTime: -1,
  handleKeyup: () => {},
  getTargetWordFromGuesses: (guesses: Array<string>) => "",
});

export const StepdleContextProvider = ({ children }: StepdleProps) => {
  const { user } = useAuth();
  const [vocabulary4, setVocabulary4] = useState<Array<string>>([""]);
  const [vocabulary5, setVocabulary5] = useState<Array<string>>([""]);
  const [vocabulary6, setVocabulary6] = useState<Array<string>>([""]);
  const [vocabulary7, setVocabulary7] = useState<Array<string>>([""]);

  const [currentTargetWord, setCurrentTargetWord] = useState<string>("");
  //const wordLength = 4;
  const [wordLength, setWordLength] = useState<number>(4);
  const maxNumGuesses = 20;

  const [words, setWords] = useState<DailyStepdleData>({
    dailyWord4: "",
    dailyWord5: "",
    dailyWord6: "",
    dailyWord7: "",
  });
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
      localStorage.getItem("StepdleGameState");
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

  // Function to load todays stepdle game from database if it exists
  const loadFromDatabase = async (): Promise<PlayedStepdleGame | null> => {
    const fetchPlayedStepdleGames = async (
      dateStartTime?: number,
      gameType?: string,
      userId?: string
    ): Promise<Array<PlayedStepdleGame>> => {
      try {
        const userToken: string | undefined = await user?.getIdToken();
        let queryString: string = "../api/played-games?";
        if (dateStartTime) {
          queryString += `date=${dateStartTime}`;
          if (gameType || userId) {
            queryString += "&";
          }
        }

        if (gameType) {
          queryString += `game=${gameType}`;
          if (userId) {
            queryString += "&";
          }
        }

        if (userId) {
          queryString += `uid=${userId}`;
        }
        const response = await fetch(queryString, {
          method: "GET",
          headers: {
            authorization: `Bearer ${userToken}`,
            "Content-type": "application/json",
          },
        });
        if (response.ok) {
          const data: Array<PlayedStepdleGame> =
            (await response.json()) as Array<PlayedStepdleGame>;
          return data;
        } else {
          throw new Error(`Failed to fetch played games: ${response.status}`);
        }
      } catch (error) {
        throw new Error(`Error fetching played games: ${error}`);
      }
    };

    const todayStartTime: number = new Date().setHours(0, 0, 0, 0);
    const playedGames: Array<PlayedStepdleGame> = await fetchPlayedStepdleGames(
      todayStartTime,
      "stepdle",
      user!.uid
    );
    const playedGameToday: PlayedStepdleGame = playedGames[0];
    if (playedGameToday) {
      let lastGuess: number = 0;
      for (let i = playedGameToday.guesses.length - 1; i >= 0; i--) {
        if (playedGameToday.guesses[i].length > 0) {
          lastGuess = i + 1;
          break;
        }
      }
      setGameLoaded(true);
      setCurrentGuess(lastGuess);
      setGuesses(playedGameToday.guesses);
      setIsGameOver(true);
      setIsGameWon(playedGameToday.wonGame);
      setStartTime(playedGameToday.startTime);
      setEndTime(playedGameToday.endTime);
    }
    return playedGameToday;
  };

  useEffect(() => {
    const fetchVocabulary = async (
      vocabularyName: string
    ): Promise<Vocabulary> => {
      try {
        const userToken: string | undefined = await user?.getIdToken();
        const response = await fetch(
          `../api/vocabulary?name=${vocabularyName}`,
          {
            method: "GET",
            headers: {
              authorization: `Bearer ${userToken}`,
              "Content-type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = (await response.json()) as Vocabulary;
          return data;
        } else {
          throw new Error(`Failed to fetch vocabulary: ${response.statusText}`);
        }
      } catch (error) {
        throw new Error(`Error fetching vocabulary: ${error}`);
      }
    };

    const fetchDailyGameData = async (
      gameType: string
    ): Promise<DailyStepdleData> => {
      try {
        const userToken: string | undefined = await user?.getIdToken();
        const response = await fetch(`../api/games?game=${gameType}`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${userToken}`,
            "Content-type": "application/json",
          },
        });
        if (response.ok) {
          const data = (await response.json()) as DailyStepdleData;
          return data;
        } else {
          throw new Error(
            `Failed to fetch daily game data: ${response.statusText}`
          );
        }
      } catch (error) {
        throw new Error(`Error fetching data: ${error}`);
      }
    };

    // Fetches vocabularies and daily game data from the database
    const loadVocabulary = async () => {
      const dailyGameData: DailyStepdleData = await fetchDailyGameData(
        "stepdle"
      );
      setWords(dailyGameData);

      const englishWords4: Vocabulary = await fetchVocabulary("englishWords4");
      const englishWords5: Vocabulary = await fetchVocabulary("englishWords5");
      const englishWords6: Vocabulary = await fetchVocabulary("englishWords6");
      const englishWords7: Vocabulary = await fetchVocabulary("englishWords7");

      setVocabulary4(englishWords4.words);
      setVocabulary5(englishWords5.words);
      setVocabulary6(englishWords6.words);
      setVocabulary7(englishWords7.words);
    };

    loadFromLocalStorage();
    loadVocabulary();
  }, [user]);

  useEffect(() => {
    const updateCurrentTargetWord = () => {
      if (guesses.includes(words.dailyWord6)) {
        setCurrentTargetWord(words.dailyWord7);
        setWordLength(7);
      } else if (guesses.includes(words.dailyWord5)) {
        setCurrentTargetWord(words.dailyWord6);
        setWordLength(6);
      } else if (guesses.includes(words.dailyWord4)) {
        setCurrentTargetWord(words.dailyWord5);
        setWordLength(6);
      } else {
        setCurrentTargetWord(words.dailyWord4);
        setWordLength(4);
      }
    };
    updateCurrentTargetWord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words]);

  useEffect(() => {
    const addPlayedGame = async (
      playedGame: PlayedStepdleGame
    ): Promise<void> => {
      try {
        const userToken: string | undefined = await user?.getIdToken();
        const response = await fetch("../api/played-games", {
          method: "POST",
          headers: {
            authorization: `Bearer ${userToken}`,
            "Content-type": "application/json",
          },
          body: JSON.stringify(playedGame),
        });
        if (response.ok) {
          const data = await response.json();
          return;
        } else {
          throw new Error(`Failed to post new game to API`);
        }
      } catch (error) {
        throw new Error(`Error posting new game: ${error}`);
      }
    };

    const sync = async () => {
      const databaseGame: PlayedStepdleGame | null = await loadFromDatabase();

      if (!databaseGame && (isGameWon || isGameOver)) {
        const endTimeUnix: number = Date.now();
        setEndTime(endTimeUnix);

        const newGame: PlayedStepdleGame = {
          userId: `Users/${user!.uid}`,
          gameType: "Games/stepdle",
          startTime: startTime,
          endTime: endTimeUnix,
          numberOfGuesses: currentGuess,
          words: [
            words.dailyWord4,
            words.dailyWord5,
            words.dailyWord6,
            words.dailyWord7,
          ],
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
    "StepdleGameState",
    {
      currentGuess: currentGuess,
      guesses: guesses,
      isGameWon: isGameWon,
      isGameOver: isGameOver,
      startTime: startTime,
      endTime: endTime,
    }
  );

  const getTargetWordFromGuesses = (guesses: Array<string>): string => {
    if (guesses.includes(words.dailyWord6)) {
      return words.dailyWord7;
    } else if (guesses.includes(words.dailyWord5)) {
      return words.dailyWord6;
    } else if (guesses.includes(words.dailyWord4)) {
      return words.dailyWord5;
    } else {
      return words.dailyWord4;
    }
  };

  const handleKeyup = useCallback(
    (e: KeyboardEvent): void => {
      setGameLoaded(false);

      const isWordInVocabulary = (word: string): boolean => {
        if (word.length === 4) {
          return vocabulary4.includes(word);
        } else if (word.length === 5) {
          return vocabulary5.includes(word);
        } else if (word.length === 6) {
          return vocabulary6.includes(word);
        } else if (word.length === 7) {
          return vocabulary7.includes(word);
        }
        throw new Error(`Provided word length: ${word.length} is not allowed`);
      };

      const updateCurrentTargetWord = () => {
        if (guesses.includes(words.dailyWord6)) {
          setCurrentTargetWord(words.dailyWord7);
          setWordLength(7);
        } else if (guesses.includes(words.dailyWord5)) {
          setCurrentTargetWord(words.dailyWord6);
          setWordLength(6);
        } else if (guesses.includes(words.dailyWord4)) {
          setCurrentTargetWord(words.dailyWord5);
          setWordLength(5);
        } else {
          setCurrentTargetWord(words.dailyWord4);
          setWordLength(4);
        }
      };

      const submitGuess = (): void => {
        if (
          guesses[currentGuess].length === wordLength &&
          isWordInVocabulary(guesses[currentGuess])
        ) {
          setCurrentGuess((prev) => prev + 1);
          updateCurrentTargetWord();

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
    [
      currentGuess,
      guesses,
      vocabulary4,
      vocabulary5,
      vocabulary6,
      vocabulary7,
      wordLength,
      words.dailyWord4,
      words.dailyWord5,
      words.dailyWord6,
      words.dailyWord7,
    ]
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
    if (guesses[currentGuess - 1] === words.dailyWord7) {
      setIsGameWon(true);
      setIsGameOver(true);
    }

    if (currentGuess === maxNumGuesses) {
      setIsGameOver(true);
    }
  }, [currentGuess, guesses, maxNumGuesses, words]);

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
    <StepdleContext.Provider
      value={{
        wordLength,
        currentTargetWord,
        words,
        maxNumGuesses,
        currentGuess,
        guesses,
        isGameWon,
        isGameOver,
        triggerShakeAnimation,
        triggerFlipAnimation,
        startTime,
        endTime,
        gameLoaded,
        handleKeyup,
        getTargetWordFromGuesses,
      }}
    >
      {children}
    </StepdleContext.Provider>
  );
};

export const useStepdle = () => {
  return useContext(StepdleContext);
};
