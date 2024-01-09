import { useEffect, useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import JSONData from "../data/questionaire.json";

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

export const Home = () => {
  const { questions, outcomes } = data;
  const [currentQuestionId, setCurrentQuestionId] = useState<string>(
    questions[0].id,
  );
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [outcome, setOutcome] = useState<OutcomeType | undefined>();
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [isAnswerSelected, setIsAnswerSelected] = useState<boolean>(false);

  //   console.log(currentQuestionId);
  //   console.log(questions.length);
  //   console.log(currentScore);

  const currentQuestion = questions.find(
    (question) => question.id === currentQuestionId,
  );

  const findCurrentQuestionIndex = questions.findIndex(
    (q) => q.id === currentQuestionId,
  );

  const allQuestionsAnswered =
    findCurrentQuestionIndex === questions.length - 1;

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

  const handleSelectAnswerClick = (answerScore: number, answerId: string) => {
    setCurrentScore((prevScore) => prevScore + answerScore);
    setSelectedAnswerId(answerId);
    setIsAnswerSelected(true);
  };

  const handleNextClick = () => {
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
  };

  const handleStartScreenClick = () => {
    setCurrentQuestionId(questions[0].id);
    setCurrentScore(0);
    setOutcome(undefined);
  };

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
    <div className="bg-white h-screen border border-red-500 flex flex-col max-h-screen-sm max-w-screen-sm justify-center items-stretch">
      {!currentQuestion && !allQuestionsAnswered && (
        <h1>Loading questions...</h1>
      )}

      {allQuestionsAnswered && outcome && (
        <div>
          <h1>Outcome</h1>
          <p>{outcome.text}</p>
          <button disabled={!outcome.show_booking_button}>
            Book a meeting
          </button>
          <button onClick={handleStartScreenClick}>
            Back to the start screen
          </button>
        </div>
      )}

      {!allQuestionsAnswered && currentQuestion && (
        <div className="border-2 border-blue-600">
          <h1 className="text-2xl text-gray-600 font-extrabold">
            {currentQuestion.question_text}
          </h1>
          <span className="flex justify-center my-10">
            {currentQuestion.answers.map((answer) => (
              <button
                key={answer.id}
                onClick={() => handleSelectAnswerClick(answer.score, answer.id)}
                className={`flex justify-around rounded-full px-8 py-4 text-sm mx-3 w-1/2 font-bold shadow-sm ring-1 ring-inset ring-gray-300
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

          <div className="border border-orange-500 flex justify-center">
            <button
              disabled={!isAnswerSelected}
              onClick={handleNextClick}
              className="disabled:opacity-75 disabled:bg-gray-300 inline-flex justify-center items-center gap-x-2 rounded-md bg-teal-600 w-4/5 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            >
              Next
              <ChevronRightIcon
                className="-mr-0.5 h-5 w-5"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
