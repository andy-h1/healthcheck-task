import { useEffect, useState } from "react";
import {
  useQuestionaireContext,
  useQuestionaireDispatch
} from "../context/QuestionaireContext";
import { OutcomeType } from "../types/questionaire";

const Summary: React.FC = () => {
  const [outcome, setOutcome] = useState<OutcomeType | undefined>(undefined);
  const context = useQuestionaireContext();
  const dispatch = useQuestionaireDispatch();
  const { questions, currentScore, outcomes } = context;

  const handleRestart = () => {
    dispatch({ type: "RESET" });
  };

  //TODO: do I need to use a useEffect? Is there a better way of approaching this?
  useEffect(() => {
    console.log("useCalculateOutcome called");
    if (questions.length === 0) return;

    // Assumption that next.outcomes will always exist in the last question object
    const lastQuestion = questions[questions.length - 1];
    const possibleOutcomes = lastQuestion.next.filter(
      (item) => item.max_score !== undefined || item.outcome !== undefined
    );

    const relevantOutcome = possibleOutcomes.find(
      (item) => item.max_score !== undefined && currentScore <= item.max_score
    );

    if (relevantOutcome) {
      const outcomeDetails = outcomes.find(
        (o) => o.id === relevantOutcome.outcome
      );
      setOutcome(outcomeDetails);
    }
  }, [questions, currentScore, outcomes]);

  return (
    <div className="mt-10 flex h-full flex-col items-center justify-between">
      <div>
        <h1 className="py-10 md:px-10">
          Thank you for answering the questions!
        </h1>
        <p className="py-10 font-[100] md:px-10">{outcome?.text}</p>
      </div>
      <button
        disabled={!outcome?.show_booking_button}
        className="w-4/5 gap-x-2 rounded-md bg-teal-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 disabled:bg-gray-300 disabled:opacity-75"
      >
        Book a meeting
      </button>

      <span>
        <button className="text-teal-400" onClick={handleRestart}>
          Back to the start screen
        </button>
      </span>
    </div>
  );
};

export default Summary;
