import { NextResponse, NextRequest } from "next/server";
import { db } from "@/app/api/firebaseAdmin";
import { verifyAuthToken } from "@/app/api/utils";
import { DecodedIdToken } from "firebase-admin/auth";
import { User } from "@/app/api/interfaces";

export async function GET(req: NextRequest) {
  try {
    const authToken: string | null = req.headers.get("authorization");
    const decodedUser: DecodedIdToken | null = await verifyAuthToken(authToken);

    if (decodedUser) {
      const userId: string = decodedUser.uid;
      const userDoc = await db.doc(`/Users/${userId}`).get();

      if (userDoc.exists) {
        const data: User = userDoc.data() as User;
        return new Response(JSON.stringify(data), {
          status: 200,
        });
      }
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  } catch (error) {
    console.error("Error in GET /api/user: ", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
