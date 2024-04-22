import { NextResponse, NextRequest } from "next/server";
import { db } from "@/app/api/firebaseAdmin";
import { getDayEnd, verifyAuthToken } from "@/app/api/utils";
import { DecodedIdToken } from "firebase-admin/auth";
import User from "@/app/api/user/route";
import GameStats from "@/app/api/user/stats/route";

// Function to get yesterday's start time in Swedish time zone
function getYesterdayStartUnixSwedishTime(): number {
  const currentDate: Date = new Date();
  const yesterday: Date = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  return yesterday.getTime() + 2 * 60 * 60 * 1000; // Add 2 hours for Swedish time zone
}

export async function POST(req: NextRequest) {
  try {
    const authToken: string | null = req.headers.get("authorization");
    const decodedUser: DecodedIdToken | null = await verifyAuthToken(authToken);

    if (decodedUser) {
      const userId: string = decodedUser.uid;
      const userDoc = await db.doc(`/Users/${userId}`).get();

      if (
        !userDoc.exists &&
        decodedUser.uid &&
        decodedUser.email &&
        decodedUser.name
      ) {
        const user: User = {
          email: decodedUser.email,
          name: decodedUser.name,
          consecutiveDaysPlayed: 0,
          lastLogin: Date.now(),
        };
        // Create new user document
        const newUserDoc = db.collection("Users").doc(decodedUser.uid);

        // Write to the new user document
        await newUserDoc.set(user);
      }

      const gameDocs = await db.collection("Games").get();
      for (const gameDoc of gameDocs.docs) {
        const userStatsDoc = await db
          .doc(`/Users/${userId}/Stats/${gameDoc.id}`)
          .get();
        if (!userStatsDoc.exists) {
          if (
            gameDoc.id === "wordle" ||
            gameDoc.id === "ordle" ||
            gameDoc.id === "stepdle"
          ) {
            const stats: GameStats = {
              averageGuesses: -1,
              averageTime: -1,
              totalGamesPlayed: -1,
              winRate: -1,
            };
            // Create stats document for a game
            const statsGameDoc = db
              .collection(`/Users/${userId}/Stats`)
              .doc(gameDoc.id);

            // Write to the new document
            await statsGameDoc.set(stats);
          } else {
            throw new Error(
              `Endpoint does not recognize game type ${gameDoc.id}`
            );
          }
        }
      }

      return new Response(
        JSON.stringify({
          message: "User initialized",
          documentId: userDoc.id,
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
    console.error("Error in POST /api/initialize-user: ", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
