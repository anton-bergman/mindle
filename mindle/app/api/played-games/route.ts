import { NextResponse, NextRequest } from "next/server";
import { db } from "@/app/api/firebaseAdmin";
import { getDayEnd, verifyAuthToken } from "../utils";
import { DecodedIdToken } from "firebase-admin/auth";
import { QueryDocumentSnapshot, Query } from "firebase-admin/firestore";

interface PlayedGame {
  userId: string;
  gameType: string;
  startTime: number;
  endTime: number;
  guesses: Array<string>;
  numberOfGuesses: number;
  wonGame: boolean;
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
      const data: PlayedGame = (await req.json()) as PlayedGame;
      const playedGameDoc = db.collection("PlayedGames").doc();
      await playedGameDoc.set(data);
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
