import JSONData from "../data/questionaire.json";
import useQuestionNavigation from "../hooks/useQuestionNavigation";
import useCalculateOutcome from "../hooks/useCalculateOutcome";
import { QuestionaireType } from "../types/questionaire";
import ProgressBar from "../components/ProgressBar";
import Summary from "../components/Summary";
import Questionaire from "../components/Questionaire";
import Header from "../components/Header";
import { useContext } from "react";
import { QuestionaireContext } from "../context/QuestionaireContext";

const QuestionairePage = (): React.ReactNode => {
  const data = JSONData as QuestionaireType;
  const { questions, outcomes } = data;
  const initialQuestionId = questions?.[0]?.id;
  const context = useContext(QuestionaireContext);

  console.log({ context });

  const {
    currentQuestionId,
    currentScore,
    selectedAnswerId,
    isAnswerSelected,
    currentQuestion,
    handleBackClick,
    handleNextClick,
    handleSelectAnswerClick,
    handleRestart
  } = useQuestionNavigation(questions, initialQuestionId);

  const outcome = useCalculateOutcome(questions, currentScore, outcomes);

  const findCurrentQuestionIndex = questions.findIndex(
    (q) => q.id === currentQuestionId
  );

  const progress = Math.round(
    (findCurrentQuestionIndex / (questions.length - 1)) * 100
  );

  const allQuestionsAnswered =
    findCurrentQuestionIndex === questions.length - 1;

  return (
    <div className="flex h-screen w-screen items-center justify-center md:bg-teal-300">
      <div className="flex h-dvh w-full max-w-screen-sm flex-col items-center justify-between bg-white px-4 py-4 md:h-4/5 md:rounded-md md:border md:border-gray-300 ">
        <div className="w-full">
          <Header
            findCurrentQuestionIndex={findCurrentQuestionIndex}
            allQuestionsAnswered={allQuestionsAnswered}
            onBack={handleBackClick}
          />
          <ProgressBar progress={progress} />
        </div>

        {!allQuestionsAnswered && currentQuestion && (
          <Questionaire
            question={currentQuestion}
            selectedAnswerId={selectedAnswerId}
            isAnswerSelected={isAnswerSelected}
            onAnswerSelect={handleSelectAnswerClick}
            onNext={handleNextClick}
          />
        )}

        {allQuestionsAnswered && outcome && (
          <Summary outcome={outcome} onRestart={handleRestart} />
        )}
      </div>
    </div>
  );
};

export default QuestionairePage;
