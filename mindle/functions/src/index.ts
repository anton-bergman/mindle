import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { DocumentData } from "firebase-admin/firestore";

admin.initializeApp();

export const chooseDailyWordWordle = onSchedule("every day 02:00", async () => {
  try {
    const wordleWordsSnapshot = await admin
      .firestore()
      .doc("Vocabularies/englishWords5")
      .get();

    const dailyWorldeSnapshot = await admin
      .firestore()
      .doc("Games/wordle")
      .get();

    const wordsData: DocumentData | undefined = wordleWordsSnapshot.data();
    const dailyGameData: DocumentData | undefined = dailyWorldeSnapshot.data();

    const wordsArray: Array<string> = wordsData?.words;
    let randomIndex: number = Math.floor(Math.random() * wordsArray.length);
    let randomWord: string = wordsArray[randomIndex];
    const previousWords: Array<string> = dailyGameData?.previousWords;

    while (previousWords.includes(randomWord)) {
      randomIndex = Math.floor(Math.random() * wordsArray.length);
      randomWord = wordsArray[randomIndex];
    }

    if (previousWords.length === 365) {
      previousWords.shift();
    }
    previousWords.push(randomWord);

    await admin
      .firestore()
      .doc("Games/wordle")
      .update({ dailyWord: randomWord, previousWords: previousWords });
  } catch (e) {
    console.log(e);
  }
});
