import { NextResponse, NextRequest } from "next/server";
import { db } from "@/app/api/firebaseAdmin";
import { verifyAuthToken } from "@/app/api/utils";
import { DecodedIdToken } from "firebase-admin/auth";

interface UserStats {
  averageGuesses: number;
  averageTime: number;
  consecutiveDaysPlayed: number;
  totalGamesPlayed: number;
  winRate: number;
}

export async function GET(req: NextRequest) {
  try {
    const authToken: string | null = req.headers.get("authorization");
    const decodedUser: DecodedIdToken | null = await verifyAuthToken(authToken);

    if (decodedUser) {
      if (req.nextUrl.searchParams.has("game")) {
        const game: string | null = req.nextUrl.searchParams.get("game");
        const userId: string = decodedUser.uid;

        const userStatsDoc = await db
          .doc(`/Users/${userId}/Stats/${game}`)
          .get();

        if (userStatsDoc.exists) {
          const data: UserStats = userStatsDoc.data() as UserStats;
          return new Response(JSON.stringify(data), {
            status: 200,
          });
        }
        return new Response(
          JSON.stringify({ error: "Stats not found for this game" }),
          {
            status: 404,
          }
        );
      }
      return new Response(JSON.stringify({ error: "Missing game parameter" }), {
        status: 400,
      });
    }
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  } catch (error) {
    console.error("Error in GET /api/user/stats: ", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
