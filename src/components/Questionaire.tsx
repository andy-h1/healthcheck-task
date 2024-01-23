import { QuestionType } from "../types/questionaire";
import { ChevronRightIcon } from "@heroicons/react/16/solid";

type QuestionaireProps = {
  question: QuestionType;
  selectedAnswerId: string | null;
  isAnswerSelected: boolean;
  onAnswerSelect: (answerId: string) => void;
  onNext: () => void;
};

const Questionaire = ({
  question,
  selectedAnswerId,
  isAnswerSelected,
  onAnswerSelect,
  onNext
}: QuestionaireProps) => {
  return (
    <div className="flex h-2/3 w-full flex-col items-center justify-between px-3 ">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-600">
          {question.question_text}
        </h1>
        <span className="my-10 flex justify-center">
          {question.answers.map((answer) => (
            <button
              key={answer.id}
              onClick={() => onAnswerSelect(answer.id)}
              className={`mx-3 inline-flex w-1/2 items-center justify-center rounded-full px-8 py-4 text-sm font-bold shadow-sm ring-1 ring-inset ring-gray-300
                        ${
                          answer.id === selectedAnswerId
                            ? "bg-teal-400 text-white"
                            : "bg-white text-teal-400"
                        }`}
            >
              {answer.label}
            </button>
          ))}
        </span>
      </div>
      <button
        onClick={onNext}
        disabled={!isAnswerSelected}
        className={`my-4 inline-flex w-full items-center justify-center  ${
          isAnswerSelected ? "bg-teal-500 hover:bg-teal-700" : "bg-gray-300"
        } rounded px-4 py-2 font-bold text-white`}
      >
        Next
        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
};

export default Questionaire;
