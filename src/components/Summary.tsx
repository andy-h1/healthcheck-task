import { OutcomeType } from "../types/questionaire.types";

interface SummaryProps {
  outcome: OutcomeType;
  onRestart: () => void;
}

const Summary: React.FC<SummaryProps> = ({ outcome, onRestart }) => {
  return (
    <div className="mt-10 flex h-full flex-col items-center justify-between">
      <div>
        <h1 className="py-10 md:px-10">
          Thank you for answering the questions!
        </h1>
        <p className="py-10 font-[100] md:px-10">{outcome.text}</p>
      </div>
      <button
        disabled={!outcome.show_booking_button}
        className="w-4/5 gap-x-2 rounded-md bg-teal-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 disabled:bg-gray-300 disabled:opacity-75"
      >
        Book a meeting
      </button>

      <span>
        <button className="text-teal-400" onClick={onRestart}>
          Back to the start screen
        </button>
      </span>
    </div>
  );
};

export default Summary;
