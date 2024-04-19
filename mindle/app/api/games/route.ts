import { NextResponse, NextRequest } from "next/server";
import { db } from "@/app/api/firebaseAdmin";
import { verifyAuthToken } from "../utils";
import { DecodedIdToken } from "firebase-admin/auth";

interface Game {
  dailyWord: string;
  previousWords: Array<string>;
}

export async function GET(req: NextRequest) {
  try {
    const authToken: string | null = req.headers.get("authorization");
    const decodedUser: DecodedIdToken | null = await verifyAuthToken(authToken);

    if (decodedUser) {
      if (req.nextUrl.searchParams.has("game")) {
        const game: string | null = req.nextUrl.searchParams.get("game");

        const dailyGameDoc = await db.doc(`/Games/${game}`).get();

        if (dailyGameDoc.exists) {
          const data: Game = dailyGameDoc.data() as Game;
          return new Response(JSON.stringify(data), {
            status: 200,
          });
        }
        return new Response(JSON.stringify({ error: "Game not found" }), {
          status: 404,
        });
      }
      return new Response(JSON.stringify({ error: "Missing game parameter" }), {
        status: 400,
      });
    }
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  } catch (error) {
    console.error("Error in GET /api/games: ", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
