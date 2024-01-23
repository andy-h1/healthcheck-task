import { ChevronLeftIcon } from "@heroicons/react/24/outline";

type HeaderProps = {
  findCurrentQuestionIndex: number;
  allQuestionsAnswered: boolean
  onBack: () => void;
}

const Header = ({
  findCurrentQuestionIndex,
  allQuestionsAnswered,
  onBack
} : HeaderProps) => {
  return (
    <span className="mb-4 flex items-center">
      {findCurrentQuestionIndex > 0 && !allQuestionsAnswered && (
        <button onClick={onBack}>
          <ChevronLeftIcon className="h-8 w-8" aria-hidden="true" />
        </button>
      )}

      <h1 className="grow text-center">Heartburn Checker</h1>
    </span>
  );
};

export default Header;
