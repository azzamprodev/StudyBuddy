export const fetchFlashCards = async ({ searchParams, currentLecture }) => {
  try {
    const text = currentLecture.summary;
    const { amount } = await searchParams;
    const response = await fetch("/api/flashcards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        amountOfFlashCards: amount,
      }),
    });

    if (response.ok) {
      const { flashCardsObject } = await response.json();
      console.log(JSON.parse(flashCardsObject));
      const flashCards = JSON.parse(flashCardsObject);
      return flashCards;
    } else {
      const { error, details } = await response.json();
      console.log("Error:", error, details);
    }
  } catch (error) {
    console.log("Error during generating flashCards:", error);
  }
};

export const handleSummarize = async ({
  setLoadSummary,
  setLoading,
  selectedFile,
  newLectureData,
  setCurrentLecture,
  toast,
  pdfToText,
}) => {
  if (!selectedFile) {
    toast({
      variant: "destructive",
      title: "Please Upload a File.",
    });
    return;
  } else if (
    !newLectureData.lectureName ||
    !newLectureData.lectureDescription
  ) {
    toast({
      variant: "destructive",
      title: "Please fill in the lecture name and description.",
    });
    return;
  }
  setLoading(true);
  try {
    const text = await pdfToText(selectedFile);
    const response = await fetch("/api/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lectureName: newLectureData.lectureName,
        lectureDescription: newLectureData.lectureDescription,
        text: text,
      }),
    });

    if (response.ok) {
      const { lectureObject } = await response.json();
      const parsedLecture = JSON.stringify(lectureObject);
      setCurrentLecture(lectureObject);
      sessionStorage.setItem("currentLecture", JSON.stringify(parsedLecture));
      setLoadSummary(true);
      setLoading(false);
    } else {
      const { error, details } = await response.json();
      console.log("Error:", error, details);
      setLoading(false);
    }
  } catch (error) {
    console.log("Error during summarization:", error);
  }
};
