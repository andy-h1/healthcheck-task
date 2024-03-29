import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useQuestionaireDispatch } from "../context/QuestionaireContext";

type HeaderProps = {
  findCurrentQuestionIndex: number;
  allQuestionsAnswered: boolean;
};

const Header = ({
  findCurrentQuestionIndex,
  allQuestionsAnswered
}: HeaderProps) => {
  const dispatch = useQuestionaireDispatch();

  const handleBack = () => {
    dispatch({ type: "HANDLE_BACK" });
  };
  return (
    <span className="mb-4 flex items-center">
      {findCurrentQuestionIndex > 0 && !allQuestionsAnswered && (
        <button onClick={handleBack}>
          <ChevronLeftIcon className="h-8 w-8" aria-hidden="true" />
        </button>
      )}

      <h1 className="grow text-center">Heartburn Checker</h1>
    </span>
  );
};

export default Header;
