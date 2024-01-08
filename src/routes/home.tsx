import { useEffect, useState } from "react";
import data from "../data/questionaire.json";

interface QuestionsType {
  id: string;
  question_text: string;
  answers: Array<Answers>;
  next: Array<NextQuestions>;
}

interface Answers {
  id: string;
  label: string;
  score: number;
}

interface NextQuestions {
  answered?: string;
  next_question?: string;
  max_score?: number;
  outcome?: string;
}

interface OutcomesType {
    id: string,
    text: string,
    show_booking_button: boolean
}

export const Home = () => {
  const { questions, outcomes } = data;
  const [currentQuestionId, setCurrentQuestionId] = useState(questions[0].id);
  const [currentScore, setCurrentScore] = useState(0);
  const [outcome, setOutcome] = useState<OutcomesType | undefined>();

  console.log(currentQuestionId);
  console.log(questions.length);
  console.log(currentScore);

  const currentQuestion: QuestionsType | undefined = questions.find(
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

  const filteredMaxScoreOutcomes = questions.reduce((accumulator: NextQuestions[], question) => {
    const filteredQuestions = question.next.filter(nextItem => nextItem.hasOwnProperty('max_score')|| nextItem.hasOwnProperty('outcome'));
    return accumulator.concat(filteredQuestions);
}, []);

  useEffect(() => {
    if (allQuestionsAnswered) {
        console.log('useEffect called');
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
