import firebase from "firebase/compat/app";
import { db } from "./firebaseConfig";
import {
  DocumentData,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
} from "firebase/firestore";

interface DatabaseUser {
  name: string;
  email: string;
}

export interface PlayedGame {
  userId: string;
  gameType: string;
  startTime: number;
  endTime: number;
  numberOfGuesses: number;
  word: string;
  guesses: Array<string>;
  wonGame: boolean;
}

/**
 * Initializes user- and stats-documents in Firestore database if they don't exist.
 * If the user document doesn't exist, it creates one with user's display name and email.
 * If stats documents for specific games don't exist, it creates them with default values.
 *
 * @param user The Firebase User object whose documents need to be initialized.
 */
export async function initializeUserDocuments(user: firebase.User) {
  const { uid, displayName, email } = user;
  if (email === null || displayName === null) {
    console.error(
      "ERROR: Firebase Auth does not recognize any user email or name and user and a user document can therefore not be initialized in the Firestore database."
    );
    return;
  }

  const userRef = doc(db, `Users/${uid}`);
  const userDocumentSnapshot = await getDoc(userRef);
  if (!userDocumentSnapshot.exists()) {
    const userData: DatabaseUser = {
      name: displayName,
      email: email,
    };
    await setDoc(userRef, userData);
  }
  const games = await getDocs(collection(db, "Games"));
  await Promise.all(
    games.docs.map(async (game) => {
      const userStatsDoc = await getDoc(
        doc(db, `Users/${uid}/Stats/${game.id}`)
      );
      if (!userStatsDoc.exists()) {
        if (
          game.id === "wordle" ||
          game.id === "ordle" ||
          game.id === "stepdle"
        ) {
          const stats = {
            averageGuesses: null,
            averageTime: null,
            consecutiveDaysPlayed: null,
            totalGamesPlayed: null,
            winRate: null,
          };
          await setDoc(doc(db, `Users/${uid}/Stats/${game.id}`), stats);
        } else {
          console.error("No added case for game: ", game.id);
        }
      }
    })
  );
}

/**
 * Reads vocabulary data from the specified Firestore document path.
 *
 * @param vocabularyPath The path to the Firestore document containing the vocabulary data.
 * @returns A Promise that resolves with the vocabulary data as a DocumentData object if the document exists.
 * @throws If the document does not exist or an error occurs during the read operation, an error is thrown.
 */
export async function readVocabulary(
  vocabularyPath: string
): Promise<DocumentData> {
  try {
    const vocabDocument = await getDoc(doc(db, vocabularyPath));
    if (vocabDocument.exists()) {
      return vocabDocument.data() as DocumentData;
    } else {
      throw new Error(
        `Error: Could not find vocabulary for path: ${vocabularyPath}`
      );
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Reads daily game data from the Firestore document specified by the given path.
 *
 * @param gamePath The path to the Firestore document containing the daily game data.
 * @returns A Promise that resolves with the daily game data as a DocumentData object.
 * @throws If the document does not exist or an error occurs during the read operation, an error is thrown.
 */
export async function readDailyGameData(
  gamePath: string
): Promise<DocumentData> {
  try {
    const gameDocument = await getDoc(doc(db, gamePath));
    if (gameDocument.exists()) {
      return gameDocument.data() as DocumentData;
    } else {
      throw new Error(`Error: Could not find game data for path: ${gamePath}`);
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Stores a record of a game in the database based on the provided game type.
 *
 * @param {PlayedGame} playedGame - The record of the played game to be stored.
 */
export async function addPlayedGame(playedGame: PlayedGame): Promise<void> {
  const gameTypeRef = doc(db, playedGame.gameType);

  // TODO: Check that the user played the game exists
  if (
    gameTypeRef.path === "Games/wordle" ||
    gameTypeRef.path === "Games/stepdle" ||
    gameTypeRef.path === "Games/ordle"
  ) {
    await addDoc(collection(db, "PlayedGames"), playedGame);
  } else {
    console.error("ERROR: No such gameType; ", playedGame.gameType);
  }
}

/**
 * Checks if a user has played a specific game type on the current day in Firestore.
 *
 * @param {string} userPath - The path to the user ID document in firestore for whom the play status needs to be checked.
 * @param {string} gameTypePath - The path to the game type document in Firestore.
 * @returns {Promise<PlayedGame | null>} A promise that resolves to a PlayedGame object if the user has played the game today, or null if not.
 * @throws {Error} Throws an error if there is any issue querying Firestore.
 */
export async function hasPlayedToday(
  userPath: string,
  gameTypePath: string
): Promise<PlayedGame | null> {
  try {
    const todayUnix: number = new Date().setHours(0, 0, 0, 0);
    const querySnapshot = await getDocs(
      query(
        collection(db, "PlayedGames"),
        where("userId", "==", userPath),
        where("gameType", "==", gameTypePath),
        where("startTime", ">=", todayUnix),
        limit(1)
      )
    );

    if (!querySnapshot.empty) {
      const playedGameData = querySnapshot.docs[0]?.data();
      const playedGame: PlayedGame | null = playedGameData
        ? (playedGameData as PlayedGame)
        : null;

      return playedGame;
    }
    return null;
  } catch (error) {
    console.error("Error in hasPlayedToday function:", error);
    return null;
  }
}
