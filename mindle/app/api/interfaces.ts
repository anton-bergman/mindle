interface Game {
  dailyWord: string;
  previousWords: Array<string>;
}

interface Vocabulary {
  wordLength: number;
  words: Array<string>;
}

interface PlayedGame {
  userId: string;
  gameType: string;
  startTime: number;
  endTime: number;
  guesses: Array<string>;
  numberOfGuesses: number;
  word: string;
  wonGame: boolean;
}

interface GameStats {
  averageGuesses: number;
  averageTime: number;
  totalGamesPlayed: number;
  winRate: number;
}

interface UserStats {
  totalGamesPlayed: number;
  consecutiveDaysPlayed: number;
}

interface User {
  email: string;
  name: string;
  consecutiveDaysPlayed: number;
  totalGamesPlayed: number;
  lastLogin: number;
}

interface GeneralLeaderboardEntry {
  user: string;
  averageWinRate: number;
  averageTime: number;
}

interface LeaderBoardEntry {
  user: string;
  averageGuesses: number;
  averageTime: number;
}

type LeaderBoard = Array<LeaderBoardEntry> | Array<GeneralLeaderboardEntry>;
// type LeaderBoard = Array<generalLeaderboardEntry | LeaderBoardEntry>;

export type {
  Game,
  Vocabulary,
  PlayedGame,
  GameStats,
  UserStats,
  User,
  LeaderBoardEntry,
  LeaderBoard,
  GeneralLeaderboardEntry,
};
