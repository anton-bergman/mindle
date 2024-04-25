import {onSchedule} from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import {DocumentData} from "firebase-admin/firestore";
import * as functions from "firebase-functions";

admin.initializeApp();
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
interface UsersSessions {
  [key: string]: DocumentData[];
}

interface leaderboardEntry {
  user: string;
  averageGuesses: number;
  averageTime: number;
}

type leaderboard = leaderboardEntry[];
/**
 * Choose a daily word for the Wordle game and reset Wordle daily leaderboard.
 * This function runs every day at 02:00.
 */
export const chooseDailyWordWordle = onSchedule("every day 02:00", async () => {
  /**
   * Generates a daily word for the Wordle game and updates the game data.
   * This function retrieves a list of words, selects a random word that
   * has not been used before,and updates the game data with the selected
   * word and the list of previous words.
   * If the list of previous words reaches a certain length, the oldest
   * word is removed.
   * @return {Promise<void>} A promise indicating the completion of
   * the operation.
   */
  async function generateDailyWordleWord(): Promise<void> {
    try {
      const wordleWordsSnapshot = await admin
        .firestore()
        .doc("Vocabularies/englishWords5")
        .get();

      const dailyWorldeSnapshot = await admin
        .firestore()
        .doc("Games/wordle")
        .get();

      const wordsData: DocumentData | undefined = wordleWordsSnapshot.data();
      const dailyGameData: DocumentData | undefined =
        dailyWorldeSnapshot.data();

      const wordsArray: Array<string> = wordsData?.words;
      let randomIndex: number = Math.floor(Math.random() * wordsArray.length);
      let randomWord: string = wordsArray[randomIndex];
      const previousWords: Array<string> = dailyGameData?.previousWords;

      while (previousWords.includes(randomWord)) {
        randomIndex = Math.floor(Math.random() * wordsArray.length);
        randomWord = wordsArray[randomIndex];
      }

      if (previousWords.length === 365) {
        previousWords.shift();
      }
      previousWords.push(randomWord);

      await admin
        .firestore()
        .doc("Games/wordle")
        .update({dailyWord: randomWord, previousWords: previousWords});
    } catch (e) {
      console.log(e);
    }
  }
  /**
   * Resets the leaderboard for the Wordle game.
   * This function clears the leaderboard data in the Firestore
   * database, effectively resetting the leaderboard to an empty
   * array. @return {Promise<void>} A promise indicating the completion
   * of the operation.
   */
  async function resetWordleLeaderboard(): Promise<void> {
    await admin
      .firestore()
      .doc("/Leaderboards/wordle")
      .update({leaderboard: []});
  }

  await generateDailyWordleWord();
  await resetWordleLeaderboard();
});

/**
 * Retrieves user sessions from the Firestore database.
 * This function fetches data from the "PlayedGames" collection
 * and organizes it into a dictionary where each user's sessions
 * are grouped by their user ID.
 * @return {Promise<UsersSessions>} A promise that resolves to a dictionary
 * where each key is a user ID and the corresponding value is an array of
 * that user's sessions.
 */
async function getUserSessions() {
  const db = admin.firestore();
  const gameSessionsSnapshot = await db.collection("/PlayedGames").get();

  const userSessions: UsersSessions = {};

  gameSessionsSnapshot.docs.map((doc) => {
    const data = doc.data();
    const id = data.userId;
    if (id in userSessions) {
      userSessions[id].push(doc.data());
    } else {
      userSessions[id] = [doc.data()];
    }
    return userSessions;
  });
  return userSessions;
}
/**
 * Create leaderboard when a new game is played.
 * This function triggers when a new document is created in the
 * PlayedGames collection.
 * @param {UsersSessions} userSessions - The user sessions data.
 */
async function createleaderboard(userSessions: UsersSessions) {
  const db = admin.firestore();
  const leaderboard: leaderboard = [];

  await Promise.all(
    Object.keys(userSessions).map(async (userPath) => {
      const userSnapshot = await db.doc(userPath).get();
      const user: DocumentData | undefined = userSnapshot.data();

      let numberOfGuess = 0;
      let numberOfGames = 0;
      let totalTime = 0;

      userSessions[userPath].forEach((gameSession) => {
        numberOfGuess += gameSession.numberOfGuesses;
        numberOfGames += 1;
        totalTime += gameSession.endTime - gameSession.startTime;
      });

      const averageGuesses = numberOfGuess / numberOfGames;
      const averageTime = totalTime / (numberOfGames * 1000);
      const leaderboardEntry: leaderboardEntry = {
        user: user?.email,
        averageGuesses: averageGuesses,
        averageTime: averageTime,
      };

      leaderboard.push(leaderboardEntry);
    })
  );
  return leaderboard;
}

/**
 * Creates the general leaderboard based on user sessions data.
 * Retrieves user sessions, generates the leaderboard, sorts it by
 average guesses,
 * and updates the Firestore document for the general leaderboard.
 * @return {Promise<void>} A promise that resolves once the leaderboard
 * is created and updated.
 */
async function createGeneralLeaderboard(): Promise<void> {
  const userSessions = await getUserSessions();
  const leaderboard = await createleaderboard(userSessions);
  leaderboard.sort((a, b) => a.averageGuesses - b.averageGuesses);
  await admin
    .firestore()
    .doc("/Leaderboards/general")
    .update({leaderboard: leaderboard});
}

/**
 * Creates the daily Wordle leaderboard for the current day.
 * Retrieves played games for the current day, generates the
 * leaderboard, sorts it by average guesses, and updates the
 * Firestore document for the daily Wordle leaderboard.
 * @return {Promise<void>} A promise that resolves once the
 * leaderboard is created and updated.
 */
async function createDailyWordleleaderboard(): Promise<void> {
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  const dateStartUnix: number = date.getTime();
  const dateEndUnix: number = dateStartUnix + 24 * 60 * 60 * 1000 - 1;
  try {
    const snapshot = await admin
      .firestore()
      .collection("/PlayedGames")
      .where("startTime", ">=", dateStartUnix)
      .where("startTime", "<=", dateEndUnix)
      .get();
    const playedGames: PlayedGame[] = snapshot.docs.map(
      (doc) => doc.data() as PlayedGame
    );
    const leaderboard: leaderboard = [];

    await Promise.all(
      playedGames.map(async (game: PlayedGame) => {
        const user = (await admin.firestore().doc(game.userId).get()).data();
        const leaderboardEntry: leaderboardEntry = {
          user: user?.email,
          averageGuesses: game.numberOfGuesses,
          averageTime: (game.endTime - game.startTime) / 1000,
        };

        leaderboard.push(leaderboardEntry);
        return leaderboard;
      })
    );

    leaderboard.sort((a, b) => a.averageGuesses - b.averageGuesses);
    await admin
      .firestore()
      .doc("/Leaderboards/wordle")
      .update({leaderboard: leaderboard});
  } catch (error) {
    console.log(error);
  }
}

export const createLeaderboards = functions.firestore
  .document("/PlayedGames/{gameId}")
  .onCreate(async () => {
    try {
      await createGeneralLeaderboard();
      await createDailyWordleleaderboard();
    } catch (error) {
      console.log(error);
    }
  });
