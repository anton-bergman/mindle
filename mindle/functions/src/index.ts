import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { DocumentData } from "firebase-admin/firestore";
import * as functions from "firebase-functions";

admin.initializeApp();

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
      .update({ dailyWord: randomWord, previousWords: previousWords });
  } catch (e) {
    console.log(e);
  }
});

/**
 * Create leaderboard when a new game is played.
 * This function triggers when a new document is created in the
 * PlayedGames collection.
 */
export const createLeaderboard = functions.firestore
  .document("/PlayedGames/{gameId}")
  .onCreate(async () => {
    type UsersSessions = {
      [key: string]: DocumentData[];
    };

    type LeaderBoardEntry = {
      user: string;
      averageGuesses: number;
      averageTime: number;
    };

    type LeaderBoard = LeaderBoardEntry[];

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
    async function createLeaderboard(userSessions: UsersSessions) {
      const leaderBoard: LeaderBoard = [];

      await Promise.all(
        Object.keys(userSessions).map(async (userPath) => {
          const userSnapshot = await db.doc(userPath).get();
          const user = userSnapshot.data();

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
          const leaderBoardEntry: LeaderBoardEntry = {
            user: user?.email,
            averageGuesses: averageGuesses,
            averageTime: averageTime,
          };

          leaderBoard.push(leaderBoardEntry);
        })
      );
      leaderBoard.sort((a, b) => a.averageGuesses - b.averageGuesses);
      return leaderBoard;
    }
    const userSessions = await getUserSessions();
    const leaderBoard = await createLeaderboard(userSessions);
    await admin
      .firestore()
      .doc("Leaderboards/general")
      .update({ leaderboard: leaderBoard });
  });
