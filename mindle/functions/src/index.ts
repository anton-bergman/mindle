import {onSchedule} from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import {
  DocumentData,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "firebase-admin/firestore";
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

interface Vocabulary {
  wordLength: number;
  words: string[];
}

interface stepdleData {
  dailyWord4: string;
  dailyWord5: string;
  dailyWord6: string;
  dailyWord7: string;
}

/**
 * Choose a daily word for the Wordle game and reset Wordle daily leaderboard.
 * This function runs every day at 02:00.
 */
export const chooseDailyWords = onSchedule("every day 22:00", async () => {
  /**
   * Generates a daily word for the specified game type and updates
   * the game data.
   * This function retrieves a list of words, selects a random word that
   * has not been used before, and updates the game data with the selected
   * word and the list of previous words. If the list of previous words
   * reaches a certain length, the oldest word is removed.
   * @param {string} gameType - The type of the game ("wordle" or "ordle").
   * @param {string} vocab - The name of the vocabulary Firestore
   * document.
   * @return {Promise<void>} A promise indicating the completion
   * of the operation.
   */
  async function generateDailyWordleOrdleWord(
    gameType: string,
    vocab: string
  ): Promise<void> {
    try {
      const wordleWordsSnapshot: DocumentData = await admin
        .firestore()
        .doc(`Vocabularies/${vocab}`)
        .get();

      const dailyWorldeSnapshot: DocumentData = await admin
        .firestore()
        .doc(`Games/${gameType}`)
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
        .doc(`Games/${gameType}`)
        .update({dailyWord: randomWord, previousWords: previousWords});
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Retrieves the list of four and five-letter words from the
   * specified vocabulary.
   *
   * @param {string} vocab - The name or identifier of the vocabulary
   * from which to retrieve the words.
   * @return {Promise<string[]>} A promise that resolves to an array
   * containing the four and five-letter words.
   */
  async function getFourFiveLetterVoacb(vocab: string): Promise<string[]> {
    const vocabWordsSnapshot: DocumentData = await admin
      .firestore()
      .doc(`Vocabularies/${vocab}`)
      .get();
    const vocabData: Vocabulary = vocabWordsSnapshot.data();
    return vocabData.words;
  }

  /**
   * Retrieves the list of six and seven-letter words from the
   * specified vocabulary.
   *
   * @param {string} vocab - The name or identifier of the vocabulary
   * from which to retrieve the words.
   * @return {Promise<string[]>} A promise that resolves to an array
   * containing the six and seven-letter words.
   */
  async function getSixSevenLetterVocab(vocab: string): Promise<string[]> {
    const vocabCollection: QuerySnapshot = await admin
      .firestore()
      .collection(`Vocabularies/${vocab}/vocabulary`)
      .get();

    let words: string[] = [];
    vocabCollection.docs.map((doc: DocumentData) => {
      const data: Vocabulary = doc.data();
      words = [...words, ...data.words];
      return words;
    });
    return words;
  }

  /**
   * Generates a random word from the given list of words, e
   * nsuring it is not included in the previousWords array if provided.
   *
   * @param {string[]} words - An array containing the list of
   * words from which to choose.
   * @param {string[] | undefined} previousWords - An array
   * containing previously selected words.
   * @return {string} A randomly selected word.
   */
  function generateDailyWord(
    words: string[],
    previousWords: string[] | undefined
  ): string {
    let randomIndex: number = Math.floor(Math.random() * words.length);
    let randomWord: string = words[randomIndex];

    while (previousWords?.includes(randomWord)) {
      randomIndex = Math.floor(Math.random() * words.length);
      randomWord = words[randomIndex];
    }
    return randomWord;
  }

  /**
   * Generates daily words for the Stepdle game by selecting
   * random words from various word lists and updating the
   * Firestore document.
   *
   * @return {Promise<void>} A promise indicating the completion of
   * the operation.
   */
  async function generateDailyStepdleWords(): Promise<void> {
    try {
      const fourLetterWords: string[] = await getFourFiveLetterVoacb(
        "englishWords4"
      );

      const fiveLetterWords: string[] = await getFourFiveLetterVoacb(
        "englishWords5"
      );

      const sixLetterWords = await getSixSevenLetterVocab("englishWords6");
      const sevenLetterWords = await getSixSevenLetterVocab("englishWords7");
      const allWords = [
        fourLetterWords,
        fiveLetterWords,
        sixLetterWords,
        sevenLetterWords,
      ];

      const stepdleDocRef = admin.firestore().doc("Games/stepdle");

      const stepdleSnapshot = await stepdleDocRef.get();
      const stepdleData: DocumentData | stepdleData | undefined =
        stepdleSnapshot.data();
      const previousWords = stepdleData?.previousWords;
      const dailyWords: string[] = [];
      if (previousWords) {
        const keys: string[] = Object.keys(previousWords).reverse();

        keys.forEach((key, i) => {
          const currentPreviousWords = previousWords[key];
          const word = generateDailyWord(allWords[i], currentPreviousWords);
          dailyWords.push(word);

          if (currentPreviousWords.length === 365) {
            currentPreviousWords.shift();
          }

          currentPreviousWords.push(word);
          previousWords[key] = currentPreviousWords;
        });
      }

      stepdleDocRef.update({
        dailyWord4: dailyWords[0],
        dailyWord5: dailyWords[1],
        dailyWord6: dailyWords[2],
        dailyWord7: dailyWords[3],
        previousWords: previousWords,
      });
    } catch (error) {
      console.log(error);
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

  await generateDailyWordleOrdleWord("wordle", "englishWords5");
  await generateDailyWordleOrdleWord("ordle", "swedishWords5");
  await generateDailyStepdleWords();
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
async function getUserSessions(): Promise<UsersSessions> {
  const db = admin.firestore();
  const gameSessionsSnapshot = await db.collection("/PlayedGames").get();

  const userSessions: UsersSessions = {};

  gameSessionsSnapshot.docs.map((doc: QueryDocumentSnapshot) => {
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
  leaderboard.sort((a, b) => {
    if (a.averageGuesses !== b.averageGuesses) {
      return a.averageGuesses - b.averageGuesses;
    } else {
      return a.averageTime - b.averageTime;
    }
  });
  await admin
    .firestore()
    .doc("/Leaderboards/general")
    .update({leaderboard: leaderboard});
}

/**
 * Creates the daily leaderboard for the specified game.
 * Retrieves played games for the current day, generates the
 * leaderboard, sorts it by average guesses and average time,
 * and updates the Firestore document for the daily leaderboard.
 * @param {string} game - The name of the game.
 * @return {Promise<void>} A promise that resolves once the
 * leaderboard is created and updated.
 */
async function createDailyWordleleaderboard(game: string): Promise<void> {
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  const dateStartUnix: number = date.getTime();
  const dateEndUnix: number = dateStartUnix + 24 * 60 * 60 * 1000 - 1;
  const gameType = `Games/${game}`;
  try {
    const snapshot = await admin
      .firestore()
      .collection("/PlayedGames")
      .where("startTime", ">=", dateStartUnix)
      .where("startTime", "<=", dateEndUnix)
      .where("gameType", "==", gameType)
      .get();
    const playedGames: PlayedGame[] = snapshot.docs.map(
      (doc: QueryDocumentSnapshot) => doc.data() as PlayedGame
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

    leaderboard.sort((a, b) => {
      if (a.averageGuesses !== b.averageGuesses) {
        return a.averageGuesses - b.averageGuesses;
      } else {
        return a.averageTime - b.averageTime;
      }
    });
    await admin
      .firestore()
      .doc(`/Leaderboards/${game}`)
      .update({leaderboard: leaderboard});
  } catch (error) {
    console.log(error);
  }
}

export const createLeaderboards = functions.firestore
  .document("/PlayedGames/{gameId}")
  .onCreate(async (change) => {
    try {
      const newData = change.data();

      await createGeneralLeaderboard();
      await createDailyWordleleaderboard(newData.gameType.split("/")[1]);
    } catch (error) {
      console.log(error);
    }
  });
