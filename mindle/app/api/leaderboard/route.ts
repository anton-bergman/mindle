import { NextResponse, NextRequest } from "next/server";
import { db } from "@/app/api/firebaseAdmin";
import { verifyAuthToken } from "@/app/api/utils";
import { DecodedIdToken } from "firebase-admin/auth";
import { LeaderBoard } from "../interfaces";

export async function GET(req: NextRequest) {
  try {
    const authToken: string | null = req.headers.get("authorization");
    const decodedUser: DecodedIdToken | null = await verifyAuthToken(authToken);

    if (decodedUser) {
      if (req.nextUrl.searchParams.has("type")) {
        const type: string | null = req.nextUrl.searchParams.get("type");
        const leaderboardDoc = await db.doc(`/Leaderboards/${type}`).get();

        if (leaderboardDoc.exists) {
          const data: LeaderBoard = leaderboardDoc.data() as LeaderBoard;
          return new Response(JSON.stringify(data), {
            status: 200,
          });
        }
        return new Response(
          JSON.stringify({ error: "Leaderboard not found" }),
          { status: 404 }
        );
      }
      return new Response(JSON.stringify({ error: "Missing type parameter" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  } catch (error) {
    console.error("Error in GET /api/leaderboard?type=: ", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
