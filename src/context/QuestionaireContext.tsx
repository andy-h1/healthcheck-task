import { createContext, useEffect, useReducer, useContext } from "react";
import {
  OutcomeType,
  QuestionaireType,
  QuestionType
} from "../types/questionaire";

type State = {
  currentQuestion?: QuestionType;
  currentQuestionId: string;
  currentScore: number;
  history: Array<{ questionId: string; score: number }>;
  selectedAnswerId?: string;
  isAnswerSelected: boolean;
  questions: Array<QuestionType>;
  outcomes: Array<OutcomeType>;
};

type Action =
  | {
      type: "SET_DATA";
      questions: Array<QuestionType>;
      outcomes: Array<OutcomeType>;
    }
  | { type: "SET_CURRENT_QUESTION"; questionId: string }
  | { type: "SELECT_ANSWER"; questionId: string }
  | { type: "HANDLE_NEXT"; selectedAnswerId: string }
  | { type: "HANDLE_BACK" }
  | { type: "RESET" };

const initialState: State = {
  currentQuestion: undefined,
  currentQuestionId: "",
  currentScore: 0,
  history: [],
  selectedAnswerId: "",
  isAnswerSelected: false,
  questions: [],
  outcomes: []
};

const QuestionaireContext = createContext<QuestionaireType | null>(null);
const QuestionaireDispatchContext = createContext<Action | null>(null);

export const useQuestionaireContext = () => {
  const context = useContext(QuestionaireContext);
  if (!context) {
    throw new Error(
      "useQuestionaireContext must be used within a QuestionaireProvider"
    );
  }
  return context;
};

export const useQuestionaireDispatch = () => {
  const context = useContext(QuestionaireDispatchContext);
  if (!context) {
    throw new Error(
      "useQuestionaireDispatch must be used within a QuestionaireProvider"
    );
  }
  return context;
};

const questionaireReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        questions: action.questions,
        outcomes: action.outcomes
      };
    case "SET_CURRENT_QUESTION":
      return {
        ...state,
        currentQuestionId: action.questionId,
        currentQuestion: state.questions.find((q) => q.id === action.questionId)
      };
    case "SELECT_ANSWER":
      return {
        ...state,
        selectedAnswerId: action.questionId,
        isAnswerSelected: true
      };
    case "HANDLE_NEXT":
      const selectedAnswer = state.currentQuestion?.answers.find(
        (answer) => answer.id === action.selectedAnswerId
      );
      const scoreIncrement = selectedAnswer ? selectedAnswer.score : 0;
      const newScore = state.currentScore + scoreIncrement;

      const nextQuestionId =
        state.currentQuestion?.next.find(
          (step) => step.answered === action.selectedAnswerId
        )?.next_question ||
        state.currentQuestion?.next.find((step) => step.next_question)
          ?.next_question;

      const updatedHistory = state.history.some(
        (entry) => entry.questionId === state.currentQuestionId
      )
        ? state.history.map((entry) =>
            entry.questionId === state.currentQuestionId
              ? { ...entry, score: scoreIncrement }
              : entry
          )
        : [
            ...state.history,
            { questionId: state.currentQuestionId, score: scoreIncrement }
          ];

      return {
        ...state,
        currentScore: newScore,
        history: updatedHistory,
        currentQuestionId: nextQuestionId || "",
        currentQuestion: state.questions.find((q) => q.id === nextQuestionId),
        selectedAnswerId: undefined,
        isAnswerSelected: false
      };
    case "HANDLE_BACK":
      if (state.history.length > 1) {
        const previousHistoryEntry = state.history[state.history.length - 1];
        const previousQuestionId = previousHistoryEntry.questionId;
        const newHistory = state.history.slice(0, -1);
        const newScore = state.currentScore - previousHistoryEntry.score;

        return {
          ...state,
          currentQuestionId: previousQuestionId,
          currentQuestion: state.questions.find(
            (q) => q.id === previousQuestionId
          ),
          currentScore: newScore,
          history: newHistory,
          selectedAnswerId: undefined,
          isAnswerSelected: false
        };
      } else if (state.history.length === 1) {
        const firstQuestionId = state.questions[0]?.id || "";
        const firstQuestion = state.questions.find(
          (q) => q.id === firstQuestionId
        );

        return {
          ...initialState,
          questions: state.questions,
          currentQuestionId: firstQuestionId,
          currentQuestion: firstQuestion
        };
      }
      return state;
    case "RESET":
      return {
        ...initialState,
        questions: state.questions,
        currentQuestionId: state.questions[0]?.id || "",
        currentQuestion: state.questions[0]
      };
    default:
      return state;
  }
};

export const QuestionaireProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(questionaireReducer, initialState);

  console.log({ state });

  useEffect(() => {
    fetch("/data/questionaire.json?url")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Issue with response: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!data) {
          throw new Error("No data found!");
        }
        const { questions, outcomes } = data;
        dispatch({
          type: "SET_DATA",
          questions: questions,
          outcomes: outcomes
        });
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  }, []);

  return (
    <QuestionaireContext.Provider value={state}>
      <QuestionaireDispatchContext.Provider value={dispatch}>
        {children}
      </QuestionaireDispatchContext.Provider>
    </QuestionaireContext.Provider>
  );
};
