import { auth } from "@/app/api/firebaseAdmin";
import { DecodedIdToken } from "firebase-admin/auth";

/**
 * Verify the authenticity of an authentication token and decode it to retrieve user information.
 *
 * @param {string | null} authToken - The authentication token to verify and decode.
 * @returns {Promise<DecodedIdToken | null>} A Promise that resolves to the decoded ID token if authentication is successful,
 *   otherwise resolves to null.
 * @throws {Error} If there's an error during token verification or decoding.
 */
async function verifyAuthToken(
  authToken: string | null
): Promise<DecodedIdToken | null> {
  if (authToken && authToken.startsWith("Bearer ")) {
    try {
      authToken = authToken.split("Bearer ")[1];
      const decodedToken: DecodedIdToken = await auth.verifyIdToken(authToken);
      return decodedToken;
    } catch (error) {
      throw new Error(`Error in function verifyAuthToken: ${error}`);
    }
  }
  return null;
}

/**
 * Calculate the Unix timestamp representing the end of a given day, based on the Unix timestamp of its start.
 *
 * @param {number} dayStartUnix - Unix timestamp representing the start of the day.
 * @returns {number} Unix timestamp representing the end of the day (23:59:59 of the same day).
 * @throws {Error} If the input dayStartUnix is NaN or Infinity.
 */
function getDayEnd(dayStartUnix: number): number {
  if (isNaN(dayStartUnix) || !isFinite(dayStartUnix)) {
    throw new Error("Invalid input: dayStartUnix must be a finite number.");
  }

  // Add the number of seconds in a day (24 hours * 60 minutes * 60 seconds) to the day start time
  // and subtract 1 second to get 23:59:59.
  const dayEndUnix: number = dayStartUnix + 24 * 60 * 60 * 1000 - 1;
  return dayEndUnix;
}

export { verifyAuthToken, getDayEnd };
