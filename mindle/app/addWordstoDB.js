import { collection, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebaseConfig";
import vocabulary from "/../../../Vocab-Creator/swe5Vocab.json";

const addWordsToDB = async function () {
  try {
    const documentRef = doc(
      db,
      "Games/xxSylp4WFTZeP2iZfTVv/vocabularies",
      "LPuZySvF1pd3VKFzGtQn"
    );
    await updateDoc(documentRef, {
      words: arrayUnion(...vocabulary), // Add new words to the existing array
    });

    console.log("Words added to the array field successfully.");
  } catch (error) {
    console.error("Error adding words to the array field:", error);
  }
};
