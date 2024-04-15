const addWordsToDB = async function () {
  const wordleVocabRef = collection(
    db,
    "Games/xxSylp4WFTZeP2iZfTVv/vocabularies"
  );

  try {
    // Retrieve the document from Firestore
    const documentRef = doc(
      db,
      "Games/xxSylp4WFTZeP2iZfTVv/vocabularies",
      "LPuZySvF1pd3VKFzGtQn"
    );
    await updateDoc(documentRef, {
      words: arrayUnion(...vocabulary), // Add new words to the existing array
    });

    // Update the words array in the document
    // await updateDoc(documentRef, {
    //   words: arrayUnion(...newWords) // Add new words to the existing array
    // });

    console.log("Words added to the array field successfully.");
  } catch (error) {
    console.error("Error adding words to the array field:", error);
  }
};
