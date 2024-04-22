import { NextResponse, NextRequest } from "next/server";
import { db } from "@/app/api/firebaseAdmin";
import { getDayEnd, verifyAuthToken } from "@/app/api/utils";
import { DecodedIdToken } from "firebase-admin/auth";
import {
  QueryDocumentSnapshot,
  Query,
  DocumentData,
} from "firebase-admin/firestore";
import GameStats from "@/app/api/user/stats/route";

export default interface PlayedGame {
  userId: string;
  gameType: string;
  startTime: number;
  endTime: number;
  guesses: Array<string>;
  numberOfGuesses: number;
  word: string;
  wonGame: boolean;
}

function updateAverageGuesses(
  prevUserStats: GameStats,
  newPlayedGame: PlayedGame
): number {
  const totalGuesses =
    prevUserStats.averageGuesses === -1
      ? newPlayedGame.numberOfGuesses
      : prevUserStats.averageGuesses * prevUserStats.totalGamesPlayed +
        newPlayedGame.numberOfGuesses;

  const totalGamesPlayed =
    prevUserStats.totalGamesPlayed === -1
      ? 1
      : prevUserStats.totalGamesPlayed + 1;
  return totalGuesses / totalGamesPlayed;
}

function updateAverageTime(
  prevUserStats: GameStats,
  newPlayedGame: PlayedGame
): number {
  const totalGameTime =
    prevUserStats.averageTime === -1
      ? newPlayedGame.endTime - newPlayedGame.startTime
      : prevUserStats.averageTime * prevUserStats.totalGamesPlayed +
        (newPlayedGame.endTime - newPlayedGame.startTime);
  const totalGamesPlayed =
    prevUserStats.totalGamesPlayed === -1
      ? 1
      : prevUserStats.totalGamesPlayed + 1;
  return totalGameTime / totalGamesPlayed;
}

function updateTotalGamesPlayed(prevUserStats: GameStats): number {
  const totalGamesPlayed =
    prevUserStats.totalGamesPlayed === -1
      ? 1
      : prevUserStats.totalGamesPlayed + 1;
  return totalGamesPlayed;
}

function updateWinRate(
  prevUserStats: GameStats,
  newPlayedGame: PlayedGame
): number {
  const totalWins =
    prevUserStats.winRate === -1
      ? newPlayedGame.wonGame
        ? 1
        : 0
      : prevUserStats.winRate * prevUserStats.totalGamesPlayed +
        (newPlayedGame.wonGame ? 1 : 0);
  const totalGamesPlayed =
    prevUserStats.totalGamesPlayed === -1
      ? 1
      : prevUserStats.totalGamesPlayed + 1;
  return totalWins / totalGamesPlayed;
}

// Function to update all fields of UserStats object
function updateUserGameStats(
  prevUserStats: GameStats,
  newPlayedGame: PlayedGame
): GameStats {
  return {
    averageGuesses: updateAverageGuesses(prevUserStats, newPlayedGame),
    averageTime: updateAverageTime(prevUserStats, newPlayedGame),
    totalGamesPlayed: updateTotalGamesPlayed(prevUserStats),
    winRate: updateWinRate(prevUserStats, newPlayedGame),
  };
}

export async function GET(req: NextRequest) {
  try {
    const authToken: string | null = req.headers.get("authorization");
    const decodedUser: DecodedIdToken | null = await verifyAuthToken(authToken);

    if (decodedUser) {
      // Extract query parameters
      const userId: string | null = req.nextUrl.searchParams.get("uid");
      const dateStartUnixString: string | null =
        req.nextUrl.searchParams.get("date");
      const gameType: string | null = req.nextUrl.searchParams.get("game");

      let query: Query = db.collection("PlayedGames");
      if (userId) {
        query = query.where("userId", "==", `Users/${userId}`);
      }
      if (dateStartUnixString) {
        const dateStartUnix: number = parseInt(dateStartUnixString);
        const dateEndUnix: number = getDayEnd(dateStartUnix);
        query = query
          .where("startTime", ">=", dateStartUnix)
          .where("startTime", "<=", dateEndUnix);
      }
      if (gameType) {
        query = query.where("gameType", "==", `Games/${gameType}`);
      }

      // Execute query
      const snapshot = await query.get();

      // Extract game data from snapshot
      const games: Array<PlayedGame> = [];
      snapshot.forEach((doc: QueryDocumentSnapshot) => {
        const gameData: PlayedGame = doc.data() as PlayedGame;
        games.push(gameData);
      });

      return new Response(JSON.stringify(games), { status: 200 });
    }

    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  } catch (error) {
    console.error("Error in GET /api/played-games: ", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authToken: string | null = req.headers.get("authorization");
    const decodedUser: DecodedIdToken | null = await verifyAuthToken(authToken);

    if (decodedUser) {
      const userId: string = decodedUser.uid;
      const playedGame: PlayedGame = (await req.json()) as PlayedGame;

      // Add played game to firestore
      const playedGameDoc = db.collection("PlayedGames").doc();
      await playedGameDoc.set(playedGame);

      // Update user stats
      const gameType: string = playedGame.gameType.replace("Games/", "");
      const userStatsDoc: DocumentData = await db
        .doc(`/Users/${userId}/Stats/${gameType}`)
        .get();

      const prevUserGameStats: GameStats = userStatsDoc.data() as GameStats;
      const newUserStats: GameStats = updateUserGameStats(
        prevUserGameStats,
        playedGame
      );
      await db.doc(`/Users/${userId}/Stats/${gameType}`).set(newUserStats);

      return new Response(
        JSON.stringify({
          message: "Game data saved",
          documentId: playedGameDoc.id,
        }),
        {
          status: 201,
        }
      );
    }
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  } catch (error) {
    console.error("Error in POST /api/played-games: ", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
