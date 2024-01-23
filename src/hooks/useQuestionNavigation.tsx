import { useReducer } from "react";
import { QuestionType } from "../types/questionaire";

type State = {
  currentQuestion: QuestionType | null;
  currentQuestionId: string;
  currentScore: number;
  history: { questionId: string; score: number }[];
  selectedAnswerId: string | null;
  isAnswerSelected: boolean;
  questions: Array<QuestionType>;
};

type Action =
  | { type: "SET_CURRENT_QUESTION"; questionId: string }
  | { type: "SELECT_ANSWER"; questionId: string | null }
  | { type: "HANDLE_NEXT"; selectedAnswerId: string }
  | { type: "HANDLE_BACK" }
  | { type: "RESET" };

const initialState: State = {
  currentQuestion: null,
  currentQuestionId: "",
  currentScore: 0,
  history: [],
  selectedAnswerId: null,
  isAnswerSelected: false,
  questions: []
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_CURRENT_QUESTION":
      return {
        ...state,
        currentQuestionId: action.questionId,
        currentQuestion:
          state.questions.find((q) => q.id === action.questionId) || null
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
        currentQuestion:
          state.questions.find((q) => q.id === nextQuestionId) || null,
        selectedAnswerId: null,
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
          currentQuestion:
            state.questions.find((q) => q.id === previousQuestionId) || null,
          currentScore: newScore,
          history: newHistory,
          selectedAnswerId: null,
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
          currentQuestion: firstQuestion || null
        };
      }
      return state;
    case "RESET":
      return {
        ...initialState,
        questions: state.questions,
        currentQuestionId: state.questions[0]?.id || "",
        currentQuestion: state.questions[0] || null
      };
    default:
      return state;
  }
};

const useQuestionNavigation = (
  questions: QuestionType[],
  initialQuestionId: string
) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    questions,
    currentQuestion: questions.find((q) => q.id === initialQuestionId) || null,
    currentQuestionId: initialQuestionId
  });

  const handleSelectAnswerClick = (answerId: string) => {
    dispatch({ type: "SELECT_ANSWER", questionId: answerId });
  };

  const handleNextClick = () => {
    if (state.isAnswerSelected && state.selectedAnswerId) {
      dispatch({
        type: "HANDLE_NEXT",
        selectedAnswerId: state.selectedAnswerId
      });
    }
  };

  const handleBackClick = () => {
    dispatch({ type: "HANDLE_BACK" });
  };

  const handleRestart = () => {
    dispatch({ type: "RESET" });
  };

  console.log(
    state.currentQuestionId,
    state.currentScore,
    state.selectedAnswerId,
    state.history
  );

  return {
    ...state,
    handleSelectAnswerClick,
    handleNextClick,
    handleBackClick,
    handleRestart
  };
};

export default useQuestionNavigation;
