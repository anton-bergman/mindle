import { NextResponse, NextRequest } from "next/server";
import { db } from "@/app/api/firebaseAdmin";
import { getDayEnd, verifyAuthToken } from "@/app/api/utils";
import { DecodedIdToken } from "firebase-admin/auth";
import { QueryDocumentSnapshot, Query } from "firebase-admin/firestore";
import GameStats from "@/app/api/user/stats/route";
import User from "@/app/api/user/route";

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

async function calculateGameStats(
  userId: string,
  gameType: string
): Promise<GameStats> {
  const query: Query = db
    .collection("PlayedGames")
    .where("userId", "==", `Users/${userId}`)
    .where("gameType", "==", `Games/${gameType}`);

  // Execute query
  const snapshot = await query.get();

  // Extract game data from snapshot
  const playedGames: Array<PlayedGame> = [];
  snapshot.forEach((doc: QueryDocumentSnapshot) => {
    const gameData: PlayedGame = doc.data() as PlayedGame;
    playedGames.push(gameData);
  });

  const totalGamesPlayed = playedGames.length;
  let totalNumGuesses: number = 0;
  let totalTime: number = 0;
  let totalNumWins: number = 0;
  for (const playedGame of playedGames) {
    totalNumGuesses += playedGame.numberOfGuesses;
    totalTime += playedGame.endTime - playedGame.startTime;
    totalNumWins += playedGame.wonGame === true ? 1 : 0;
  }

  const newGameStats: GameStats = {
    averageGuesses: totalNumGuesses / totalGamesPlayed,
    averageTime: totalTime / totalGamesPlayed,
    totalGamesPlayed: totalGamesPlayed,
    winRate: totalNumWins / totalGamesPlayed,
  };
  return newGameStats;
}

async function calculateConsecutiveDaysPlayed(userId: string): Promise<number> {
  const query: Query = db
    .collection("PlayedGames")
    .where("userId", "==", `Users/${userId}`);
  const snapshot = await query.get();

  const playedGames: Array<PlayedGame> = [];
  snapshot.forEach((doc: QueryDocumentSnapshot) => {
    const gameData: PlayedGame = doc.data() as PlayedGame;
    playedGames.push(gameData);
  });

  const playedDaysSet: Set<string> = new Set<string>();
  for (const playedGame of playedGames) {
    const date: string = new Date(playedGame.startTime).toDateString();
    playedDaysSet.add(date);
  }

  let consecutiveDaysPlayed: number = 0;
  const today: Date = new Date();
  let i: Date = today;
  while (playedDaysSet.has(i.toDateString())) {
    consecutiveDaysPlayed++;
    i.setDate(i.getDate() - 1);
  }

  console.log("playedDatesSet: ", playedDaysSet);
  console.log("consecutiveDaysPlayed: ", consecutiveDaysPlayed);
  return consecutiveDaysPlayed;
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
      const newGameStats: GameStats = await calculateGameStats(
        userId,
        gameType
      );
      await db.doc(`/Users/${userId}/Stats/${gameType}`).set(newGameStats);

      // Update consecutive days played
      const userDoc = await db.doc(`/Users/${userId}`).get();
      const user: User = userDoc.data() as User;
      const consecutiveDaysPlayed: number =
        await calculateConsecutiveDaysPlayed(userId);
      const updatedUser: User = {
        ...user,
        consecutiveDaysPlayed: consecutiveDaysPlayed,
      };
      await db.doc(`/Users/${userId}`).set(updatedUser);

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
