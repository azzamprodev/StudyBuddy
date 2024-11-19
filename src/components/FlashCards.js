import { useState } from "react";
import { Button } from "./ui/button";
import { HashLoader } from "react-spinners";
import JSConfetti from "js-confetti";
import { useToast } from "@/hooks/use-toast";
import { useLecture } from "@/app/context/useLecture";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "./ui/card";

export const FlashCards = ({ flashCards, setFlashCards }) => {
  const { toast } = useToast();
  const jsConfetti = new JSConfetti();
  const { setCurrentLecture } = useLecture();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [loadingScore, setLoadingScore] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const router = useRouter();

  if (!flashCards?.flashCards?.length) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-2xl text-center font-semibold text-red-500">
            No flashcards available! Try going back to the dashboard.
          </p>
          <Link href={"/dashboard"}>
            <Button>Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (index) => {
    if (selectedAnswer === index) {
      setSelectedAnswer(null);
    } else {
      setSelectedAnswer(index);
    }
  };

  const calculateScore = (allAnswers) => {
    let score = 0;
    allAnswers.forEach((answer) => {
      if (answer.selectedAnswer.correct) {
        score += 1;
      }
    });
    setCurrentScore(score);
    score = 0;
  };

  const nextQuestion = () => {
    if (selectedAnswer !== null) {
      setAnswers((prevAnswers) => {
        const updatedAnswers = [
          ...prevAnswers,
          {
            question: flashCards.flashCards[currentQuestion].question,
            selectedAnswer:
              flashCards.flashCards[currentQuestion].answers[selectedAnswer],
          },
        ];

        if (currentQuestion < flashCards.flashCards.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          setQuizFinished(true);
          setLoadingScore(true);

          setTimeout(() => {
            setLoadingScore(false);
            calculateScore(updatedAnswers);
            jsConfetti.addConfetti();
            console.log(answers);
          }, 2000);
        }

        return updatedAnswers;
      });

      setSelectedAnswer(null);
    } else {
      toast({
        variant: "destructive",
        title: "Please Select an answer.",
      });
    }
  };

  function handleShowAnswers() {
    if (showAnswers) {
      setShowAnswers(false);
    } else setShowAnswers(true);
  }

  const getResultMessage = () => {
    if (currentScore === flashCards.flashCards.length) {
      return { message: "Perfect! ✨", color: "text-emerald-400" };
    } else if (
      currentScore >=
      flashCards.flashCards.length - flashCards.flashCards.length / 2
    ) {
      return { message: "Great Job 🎉", color: "text-emerald-400" };
    } else if (currentScore > 0) {
      return { message: "It's fine, let's try again!", color: "text-black" };
    } else {
      return { message: "Try again!", color: "text-red-500" };
    }
  };

  const { message, color } = getResultMessage();

  return (
    <>
      {!quizFinished ? (
        <div className="h-[90vh] flex flex-col items-center justify-center gap-8">
          <div className="flex flex-col justify-center items-center gap-1">
            <h1 className="text-3xl md:text-4xl font-semibold">Flash Cards</h1>
            <p className="">{`Question: ${currentQuestion + 1}/${
              flashCards.flashCards.length
            }`}</p>
          </div>
          {flashCards.flashCards[currentQuestion] && (
            <>
              <div className=" bg-gray-200 dark:bg-slate-900 flex items-center justify-center rounded-lg w-[45vh] md:w-[60vh] lg:w-[90vh] h-[12vh] px-8 md:text-lg">
                {flashCards.flashCards[currentQuestion].question}
              </div>

              <div className="grid lg:grid-cols-2 gap-4">
                {flashCards.flashCards[currentQuestion].answers.map(
                  (answerObj, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`bg-gray-50 dark:bg-slate-800 p-4 rounded-lg w-[45vh] md:w-[60vh] lg:w-[45vh] h-[10vh] md:text-lg ${
                        selectedAnswer === index
                          ? "border-2 border-black dark:border-white"
                          : ""
                      }`}
                    >
                      {answerObj.answer}
                    </button>
                  )
                )}
              </div>
            </>
          )}
          <div className="flex flex-col justify-center items-center gap-2">
            <Button
              onClick={nextQuestion}
              className="py-6 hover:scale-110 transition-all duration-300"
            >
              {currentQuestion < flashCards.flashCards.length - 1
                ? "Next Question"
                : "Finish Quiz"}
            </Button>
            <Button
              variant="Link"
              className="underline"
              onClick={() => {
                if (currentQuestion === 0) {
                  router.push("/dashboard/summarizer");
                } else {
                  setSelectedAnswer(null);
                  setCurrentQuestion(currentQuestion - 1);
                }
              }}
            >
              {currentQuestion === 0 ? "Back to summary" : "Previous Question"}
            </Button>
          </div>
        </div>
      ) : loadingScore ? (
        <div className="h-[90vh] flex flex-col items-center justify-center gap-8">
          <h1 className="text-3xl md:text-4xl font-semibold">
            Calculating Score...
          </h1>
          <HashLoader color={"#f8eb25"} />
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <div className="container flex flex-col max-w-lg px-4 gap-6 my-10">
            <h1 className="text-3xl md:text-4xl font-semibold text-center">
              Your Score
            </h1>
            <Card className="p-8">
              <div className="flex flex-col gap-2 items-center justify-center">
                <h1
                  className={`text-4xl `}
                >{`${currentScore}/${flashCards.flashCards.length}`}</h1>
                <p className={`font-bold text-2xl`}>{message}</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 mt-4">
                <table
                  className={`table-auto w-full border-collapse ${
                    showAnswers ? "" : "hidden"
                  }`}
                >
                  <thead>
                    <tr className="bg-gray-200 dark:bg-slate-700">
                      <th className="border border-gray-400 dark:border-slate-600 px-4 py-2">
                        Question
                      </th>
                      <th className="border border-gray-400 dark:border-slate-600 px-4 py-2">
                        Selected Answer
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {answers.map((answerObj, index) => (
                      <tr key={index} className="bg-white dark:bg-slate-800">
                        <td className="border border-gray-400 dark:border-slate-600 px-4 py-2">
                          {answerObj.question}
                        </td>
                        <td
                          className={`border border-gray-400 dark:border-slate-600 px-4 py-2 ${
                            answerObj.selectedAnswer.correct
                              ? "bg-emerald-300 dark:bg-emerald-700"
                              : "bg-red-400 dark:bg-destructive"
                          }`}
                        >
                          {answerObj.selectedAnswer.answer}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Button
                  variant="destructive"
                  className="py-4 px-6 rounded-lg"
                  onClick={() => {
                    handleShowAnswers();
                  }}
                >
                  {showAnswers ? "Hide Answers" : "Show Answers"}
                </Button>
              </div>
            </Card>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setCurrentQuestion(0);
                  setQuizFinished(false);
                  setCurrentScore(0);
                  setAnswers([]);
                  setShowAnswers(false);
                }}
                className="py-6 hover:scale-110 transition-all duration-300"
              >
                Try Again
              </Button>
              <Link href={"/dashboard"}>
                <Button
                  className="py-6 hover:scale-110 transition-all duration-300"
                  onClick={() => {
                    setCurrentLecture(null);
                    sessionStorage.removeItem("currentLecture");
                    setShowAnswers(false);
                  }}
                >
                  Back Home
                </Button>
              </Link>
            </div>
            {/* <div>
              <h1 className="text-3xl md:text-4xl font-semibold">Your Score</h1>
              <Card className="flex gap-4 flex-col justify-center items-center">
                <div className="flex flex-col gap-2 items-center justify-center">
                  <h1
                    className={`text-4xl `}
                  >{`${currentScore}/${flashCards.flashCards.length}`}</h1>
                  <p className={`font-bold text-2xl`}>{message}</p>
                </div>
                <table
                  className={`table-auto w-full border-collapse ${
                    showAnswers ? "" : "hidden"
                  }`}
                >
                  <thead>
                    <tr className="bg-gray-200 dark:bg-slate-700">
                      <th className="border border-gray-400 dark:border-slate-600 px-4 py-2">
                        Question
                      </th>
                      <th className="border border-gray-400 dark:border-slate-600 px-4 py-2">
                        Selected Answer
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {answers.map((answerObj, index) => (
                      <tr key={index} className="bg-white dark:bg-slate-800">
                        <td className="border border-gray-400 dark:border-slate-600 px-4 py-2">
                          {answerObj.question}
                        </td>
                        <td
                          className={`border border-gray-400 dark:border-slate-600 px-4 py-2 ${
                            answerObj.selectedAnswer.correct
                              ? "bg-emerald-300 dark:bg-emerald-700"
                              : "bg-red-400 dark:bg-destructive"
                          }`}
                        >
                          {answerObj.selectedAnswer.answer}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Button
                  variant="destructive"
                  className="py-4 px-6 rounded-lg"
                  onClick={() => {
                    handleShowAnswers();
                  }}
                >
                  {showAnswers ? "Hide Answers" : "Show Answers"}
                </Button>
              </Card>
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setCurrentQuestion(0);
                    setQuizFinished(false);
                    setCurrentScore(0);
                    setAnswers([]);
                    setShowAnswers(false);
                  }}
                  className="py-6 hover:scale-110 transition-all duration-300"
                >
                  Try Again
                </Button>
                <Link href={"/dashboard"}>
                  <Button
                    className="py-6 hover:scale-110 transition-all duration-300"
                    onClick={() => {
                      setCurrentLecture(null);
                      sessionStorage.removeItem("currentLecture");
                      setShowAnswers(false);
                    }}
                  >
                    Back Home
                  </Button>
                </Link>
              </div>
            </div> */}
          </div>
        </div>
      )}
    </>
  );
};
