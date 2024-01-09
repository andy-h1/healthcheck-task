import { ChevronLeftIcon } from "@heroicons/react/24/outline";

interface HeaderProps {
  findCurrentQuestionIndex: number;
  onBack: () => void;
}

const Header: React.FC<HeaderProps> = ({
  findCurrentQuestionIndex,
  onBack
}) => {
  return (
    <span className="mb-4 flex items-center">
      {findCurrentQuestionIndex > 0 && (
        <button onClick={onBack}>
          <ChevronLeftIcon className="h-8 w-8" aria-hidden="true" />
        </button>
      )}

      <h1 className="grow text-center">Heartburn Checker</h1>
    </span>
  );
};

export default Header;
