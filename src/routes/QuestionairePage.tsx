import ProgressBar from "../components/ProgressBar";
import Summary from "../components/Summary";
import Questionaire from "../components/Questionaire";
import Header from "../components/Header";
import { useQuestionaireContext } from "../context/QuestionaireContext";

const QuestionairePage = (): React.ReactNode => {
  const heartBurnData = useQuestionaireContext();
  const { currentQuestion, currentQuestionId, questions } = heartBurnData;

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
          />
          <ProgressBar progress={progress} />
        </div>

        {!allQuestionsAnswered && currentQuestion && <Questionaire />}

        {allQuestionsAnswered && <Summary />}
      </div>
    </div>
  );
};

export default QuestionairePage;
