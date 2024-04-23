import { NextResponse, NextRequest } from "next/server";
import { db } from "@/app/api/firebaseAdmin";
import { verifyAuthToken } from "@/app/api/utils";
import { DecodedIdToken } from "firebase-admin/auth";
import { Vocabulary } from "@/app/api/interfaces";

export async function GET(req: NextRequest) {
  try {
    const authToken: string | null = req.headers.get("authorization");
    const decodedUser: DecodedIdToken | null = await verifyAuthToken(authToken);

    if (decodedUser) {
      if (req.nextUrl.searchParams.has("name")) {
        const vocabularyName: string | null =
          req.nextUrl.searchParams.get("name");
        const vocabDocument = await db
          .doc(`/Vocabularies/${vocabularyName}`)
          .get();

        if (vocabDocument.exists) {
          const data: Vocabulary = vocabDocument.data() as Vocabulary;
          return new Response(JSON.stringify(data), {
            status: 200,
          });
        }
        return new Response(JSON.stringify({ error: "Vocabulary not found" }), {
          status: 404,
        });
      }
      return new Response(
        JSON.stringify({ error: "Missing vocabulary name" }),
        {
          status: 400,
        }
      );
    }
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  } catch (error) {
    console.error("Error in GET /api/vocabulary: ", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
