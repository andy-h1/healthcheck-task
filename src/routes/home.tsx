import { useEffect, useState } from "react";
import JSONData from "../data/questionaire.json";

interface QuestionaireType {
    questions: Array<QuestionType>,
    outcomes: Array<OutcomeType>
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
    id: string,
    text: string,
    show_booking_button: boolean
}

const data = JSONData as QuestionaireType

export const Home = () => {
  const { questions, outcomes } = data
  const [currentQuestionId, setCurrentQuestionId] = useState<string>(questions[0].id);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [outcome, setOutcome] = useState<OutcomeType | undefined>();

  console.log(currentQuestionId);
  console.log(questions.length);
  console.log(currentScore);

  const currentQuestion = questions.find(
    (question) => question.id === currentQuestionId,
  );

  const findCurrentQuestionIndex = questions.findIndex(q => q.id === currentQuestionId)

  const allQuestionsAnswered = findCurrentQuestionIndex === questions.length - 1;
  console.log(allQuestionsAnswered);

  const selectedAnswer = (answerScore: number, answerId: string) => {
    setCurrentScore((prevScore) => prevScore + answerScore);
    console.log(answerId);

    const findNextQuestion =
      currentQuestion?.next.find(
        (question) => question.answered === answerId,
      ) || currentQuestion?.next.find((question) => question.next_question);
    console.log(findNextQuestion);
    if (findNextQuestion && findNextQuestion.next_question) {
      setCurrentQuestionId(findNextQuestion.next_question);
    } else {
      console.log("show outcome");
    }
  };

  // Assumption that the last question in JSON will always contain max_score and outcome:
  const lastQuestionInArray = questions[questions.length - 1].next;
  const filteredMaxScoreOutcomes = lastQuestionInArray.filter(nextItem => nextItem.hasOwnProperty('max_score')|| nextItem.hasOwnProperty('outcome'));


// If not then use reduce and filter to go through all the questions:
//   const filteredMaxScoreOutcomes = questions.reduce((accumulator: NextStep[], question) => {
//     const filteredQuestions = question.next.filter(nextItem => nextItem.hasOwnProperty('max_score')|| nextItem.hasOwnProperty('outcome'));
//     return accumulator.concat(filteredQuestions);
// }, []);


  useEffect(() => {
    if (allQuestionsAnswered) {
        const relevantOutcome = filteredMaxScoreOutcomes.find(outcome => !outcome.max_score || currentScore <= outcome.max_score)
        console.log({relevantOutcome});
    if (relevantOutcome) {
        const outcomeDetails = outcomes.find(o => o.id === relevantOutcome.outcome);
        console.log({outcomeDetails})
        setOutcome(outcomeDetails);  
    }
    }  
  }, [allQuestionsAnswered, currentScore, outcomes, questions])

  return (
    <>
      {!currentQuestion && !allQuestionsAnswered && (
        <h1>Loading questions...</h1>
      )}

      {allQuestionsAnswered && outcome && (
        <div>
            <h1>Outcome</h1>
            <p>{outcome.text}</p>
        </div>
      )
    }

    {!allQuestionsAnswered && currentQuestion && (
        <div>
        <h1>{currentQuestion.question_text}</h1>
        {currentQuestion.answers.map((answer) => (
          <button
            key={answer.id}
            onClick={() => selectedAnswer(answer.score, answer.id)}
            className="mx-1 rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 active:bg-teal-100"
          >
            {answer.label}
          </button>
        ))}
      </div>
    )}
</>
  );
};
