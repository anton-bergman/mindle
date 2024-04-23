import {onSchedule} from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import {DocumentData} from "firebase-admin/firestore";
import * as functions from "firebase-functions";
// import { onRequest } from "firebase-functions/v2/https";

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
 * Choose a daily word for the Wordle game.
 * This function runs every day at 02:00.
 */
export const chooseDailyWordWordle = onSchedule("every day 02:00", async () => {
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
    const dailyGameData: DocumentData | undefined = dailyWorldeSnapshot.data();

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
});

/**
 * Create leaderboard when a new game is played.
 * This function triggers when a new document is created in the
 * PlayedGames collection.
 */
export const createleaderboardGeneral = functions.firestore
  .document("/PlayedGames/{gameId}")
  .onCreate(async () => {
    const db = admin.firestore();
    /**
     * Create leaderboard when a new game is played.
     * This function triggers when a new document is created in the
     * PlayedGames collection.
     */
    async function getUserSessions() {
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
    const userSessions = await getUserSessions();
    const leaderboard = await createleaderboard(userSessions);
    leaderboard.sort((a, b) => a.averageGuesses - b.averageGuesses);
    await admin
      .firestore()
      .doc("/Leaderboards/general")
      .update({leaderboard: leaderboard});
  });

export const createDailyWordleleaderboard = functions.firestore
  .document("/PlayedGames/{gameId}")
  .onCreate(async () => {
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
  });
