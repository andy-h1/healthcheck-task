import { useEffect, useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import JSONData from "./data/questionaire.json";

interface QuestionaireType {
  questions: Array<QuestionType>;
  outcomes: Array<OutcomeType>;
}

interface QuestionType {
  id: string;
  question_text: string;
  answers: Array<Answer>;
  next: Array<NextStep>;
}

interface Answer {
  id: string;
  label: string;
  score: number;
}

interface NextStep {
  answered?: string;
  next_question?: string;
  max_score?: number;
  outcome?: string;
}

interface OutcomeType {
  id: string;
  text: string;
  show_booking_button: boolean;
}

const data = JSONData as QuestionaireType;

const App = () => {
  const { questions, outcomes } = data;
  const [currentQuestionId, setCurrentQuestionId] = useState<string>(
    questions[0].id,
  );
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [outcome, setOutcome] = useState<OutcomeType | undefined>();
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [isAnswerSelected, setIsAnswerSelected] = useState<boolean>(false);
  const [history, setHistory] = useState<
    { questionId: string; score: number }[]
  >([]);

  const currentQuestion = questions.find(
    (question) => question.id === currentQuestionId,
  );

  const findCurrentQuestionIndex = questions.findIndex(
    (q) => q.id === currentQuestionId,
  );

  const allQuestionsAnswered =
    findCurrentQuestionIndex === questions.length - 1;

  const questionaireProgress = Math.round(
    (findCurrentQuestionIndex / (questions.length - 1)) * 100,
  );

  // Assumption that the last question in JSON will always contain max_score and outcome:
  const lastQuestionInArray = questions[questions.length - 1].next;
  const filteredMaxScoreOutcomes = lastQuestionInArray.filter(
    (nextItem) =>
      nextItem.hasOwnProperty("max_score") ||
      nextItem.hasOwnProperty("outcome"),
  );

  // If not then use reduce and filter to go through all the questions:
  //   const filteredMaxScoreOutcomes = questions.reduce((accumulator: NextStep[], question) => {
  //     const filteredQuestions = question.next.filter(nextItem => nextItem.hasOwnProperty('max_score')|| nextItem.hasOwnProperty('outcome'));
  //     return accumulator.concat(filteredQuestions);
  // }, []);

  const handleSelectAnswerClick = (answerId: string) => {
    setSelectedAnswerId(answerId);
    setIsAnswerSelected(true);
  };

  const handleNextClick = () => {
    if (isAnswerSelected && selectedAnswerId) {
      const selectedAnswerScore =
        currentQuestion?.answers.find(
          (answer) => answer.id === selectedAnswerId,
        )?.score || 0;

      setCurrentScore((prevScore) => prevScore + selectedAnswerScore);

      setHistory((prevHistory) => [
        ...prevHistory,
        { questionId: currentQuestionId, score: selectedAnswerScore },
      ]);

      const findNextQuestion =
        currentQuestion?.next.find(
          (question) => question.answered === selectedAnswerId,
        ) || currentQuestion?.next.find((question) => question.next_question);
      console.log(findNextQuestion);
      if (findNextQuestion && findNextQuestion.next_question) {
        setCurrentQuestionId(findNextQuestion.next_question);
        setIsAnswerSelected(false);
        setSelectedAnswerId(null);
      } else {
        console.log("show outcome");
      }
    }
  };

  // this function completely clears state - starts from the beginning again;
  const handleStartScreenClick = () => {
    setCurrentQuestionId(questions[0].id);
    setCurrentScore(0);
    setOutcome(undefined);
    setHistory([]);
    setIsAnswerSelected(false);
    setSelectedAnswerId(null);
  };

  const handleBackClick = () => {
    if (history.length > 1) {
      // Remove the latest entry from history
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);

      // Set the current question to the last one in the updated history
      const previousQuestion = newHistory[newHistory.length - 1];
      setCurrentQuestionId(previousQuestion.questionId);

      // Recalculate the score based on the new history
      const newScore = newHistory.reduce((acc, item) => acc + item.score, 0);
      setCurrentScore(newScore);
      console.log(currentScore);

      setIsAnswerSelected(false);
      setSelectedAnswerId(null);
    } else {
      handleStartScreenClick();
    }
  };

  console.log(currentScore);

  useEffect(() => {
    if (allQuestionsAnswered) {
      const relevantOutcome = filteredMaxScoreOutcomes.find(
        (outcome) => !outcome.max_score || currentScore <= outcome.max_score,
      );
      console.log({ relevantOutcome });
      if (relevantOutcome) {
        const outcomeDetails = outcomes.find(
          (o) => o.id === relevantOutcome.outcome,
        );
        console.log({ outcomeDetails });
        setOutcome(outcomeDetails);
      }
    }
  }, [allQuestionsAnswered, currentScore, outcomes, filteredMaxScoreOutcomes]);

  return (
    <div className="bg-white h-dvh border border-red-500 flex flex-col max-h-screen-sm max-w-screen-sm justify-between items-center px-4 py-4">
      <div className="w-full">
        <span className="flex items-center mb-4">
          {findCurrentQuestionIndex > 0 && (
            <button onClick={handleBackClick}>
              <ChevronLeftIcon className="h-8 w-8" aria-hidden="true" />
            </button>
          )}

          <h1 className="text-center grow">Heartburn Checker</h1>
        </span>
        <div className="bg-gray-200 rounded-xl overflow-hidden">
          <div className="relative h-0.5 flex items-center justify-center">
            <div
              style={{ width: `${questionaireProgress}%` }}
              className="absolute top-0 bottom-0 left-0 rounded-lg bg-teal-400"
            ></div>
          </div>
        </div>
      </div>

      {!currentQuestion && !allQuestionsAnswered && (
        <h1>Loading questions...</h1>
      )}

      {allQuestionsAnswered && outcome && (
        <div className="h-full mt-10 border-4 border-pink-300 flex flex-col">
          <div className="justify-self-start">
            <h1>Thank you for answering the questions!</h1>
            <p>{outcome.text}</p>
            <button
              className="disabled:opacity-75 disabled:bg-gray-300 gap-x-2 rounded-md bg-teal-600 w-4/5 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              disabled={!outcome.show_booking_button}
            >
              Book a meeting
            </button>
            <span className="justify-self-end">
              <button
                className="underline-offset-auto text-teal-400"
                onClick={handleStartScreenClick}
              >
                Back to the start screen
              </button>
            </span>
          </div>
        </div>
      )}

      {!allQuestionsAnswered && currentQuestion && (
        <>
          <div className="border-2 border-blue-600">
            <h1 className="text-2xl text-gray-600 font-extrabold">
              {currentQuestion.question_text}
            </h1>
            <span className="flex justify-center my-10">
              {currentQuestion.answers.map((answer) => (
                <button
                  key={answer.id}
                  onClick={() => handleSelectAnswerClick(answer.id)}
                  className={`inline-flex justify-center items-center rounded-full px-8 py-4 text-sm mx-3 w-1/2 font-bold shadow-sm ring-1 ring-inset ring-gray-300
            ${
              answer.id === selectedAnswerId
                ? "bg-teal-400 text-white"
                : "bg-white text-teal-400"
            }`}
                >
                  {answer.label}
                  {answer.id === selectedAnswerId && (
                    <CheckCircleIcon
                      className="-mr-0.5 h-5 w-5"
                      aria-hidden="true"
                    />
                  )}
                </button>
              ))}
            </span>
          </div>

          <div className="border border-orange-500 flex w-full justify-center">
            <button
              disabled={!isAnswerSelected}
              onClick={handleNextClick}
              className="disabled:opacity-75 disabled:bg-gray-300 inline-flex justify-center items-center gap-x-2 rounded-md bg-teal-400 w-4/5 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            >
              Next
              <ChevronRightIcon
                className="-mr-0.5 h-5 w-5"
                aria-hidden="true"
              />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
