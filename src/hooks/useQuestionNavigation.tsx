import { useReducer } from "react";
import { QuestionType } from "../types/questionaire.types";

type State = {
  currentQuestion: QuestionType | null;
  currentQuestionId: string;
  currentScore: number;
  history: { questionId: string; score: number }[];
  selectedAnswerId: string | null;
  isAnswerSelected: boolean;
  questions: QuestionType[];
};

type Action =
  | { type: "SET_CURRENT_QUESTION"; payload: string }
  | { type: "SET_SCORE"; payload: number }
  | { type: "SET_HISTORY"; payload: { questionId: string; score: number }[] }
  | { type: "UPDATE_HISTORY"; payload: { questionId: string; score: number } }
  | { type: "SELECT_ANSWER"; payload: string | null }
  | { type: "RESET" };

const initialState: State = {
  currentQuestion: null,
  currentQuestionId: "",
  currentScore: 0,
  history: [],
  selectedAnswerId: null,
  isAnswerSelected: false,
  questions: [],
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_CURRENT_QUESTION":
      return {
        ...state,
        currentQuestionId: action.payload,
        currentQuestion:
          state.questions.find((q) => q.id === action.payload) || null,
      };
    case "SET_SCORE":
      return {
        ...state,
        currentScore: action.payload,
      };
    case "SET_HISTORY":
      return {
        ...state,
        history: action.payload,
      };
    case "UPDATE_HISTORY":
      return {
        ...state,
        history: [...state.history, action.payload],
      };
    case "SELECT_ANSWER":
      return {
        ...state,
        selectedAnswerId: action.payload,
        isAnswerSelected: true,
      };
    case "RESET":
      return {
        ...initialState,
        questions: state.questions,
        currentQuestionId: state.questions[0]?.id || "",
        currentQuestion: state.questions[0] || null,
      };
    default:
      return state;
  }
};

const useQuestionNavigation = (
  questions: QuestionType[],
  initialQuestionId: string,
) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    questions,
    currentQuestion: questions.find((q) => q.id === initialQuestionId) || null,
    currentQuestionId: initialQuestionId,
  });

  const handleSelectAnswerClick = (answerId: string) => {
    dispatch({ type: "SELECT_ANSWER", payload: answerId });
  };

  const handleNextClick = () => {
    if (
      state.isAnswerSelected &&
      state.selectedAnswerId &&
      state.currentQuestion
    ) {
      const selectedAnswer = state.currentQuestion.answers.find(
        (answer) => answer.id === state.selectedAnswerId,
      );
      const selectedAnswerScore = selectedAnswer ? selectedAnswer.score : 0;

      dispatch({
        type: "SET_SCORE",
        payload: state.currentScore + selectedAnswerScore,
      });

      if (
        state.history[state.history.length - 1]?.questionId !==
        state.currentQuestionId
      ) {
        dispatch({
          type: "UPDATE_HISTORY",
          payload: {
            questionId: state.currentQuestionId,
            score: selectedAnswerScore,
          },
        });
      }

      const nextStep =
        state.currentQuestion.next.find(
          (step) => step.answered === state.selectedAnswerId,
        ) || state.currentQuestion.next.find((step) => step.next_question);

      if (nextStep && nextStep.next_question) {
        dispatch({
          type: "SET_CURRENT_QUESTION",
          payload: nextStep.next_question,
        });
      }
    }
  };

  const handleBackClick = () => {
    if (state.history.length > 1) {
      const newHistory = state.history.slice(0, -1);
      const previousQuestion = newHistory[newHistory.length - 1];

      dispatch({
        type: "SET_CURRENT_QUESTION",
        payload: previousQuestion.questionId,
      });
      const newScore = newHistory.reduce((acc, item) => acc + item.score, 0);
      dispatch({
        type: "SET_SCORE",
        payload: newScore,
      });
      dispatch({
        type: "SET_HISTORY",
        payload: newHistory,
      });
    } else if (state.history.length === 1) {
      dispatch({ type: "RESET" });
    }
  };

  const handleRestart = () => {
    dispatch({ type: "RESET" });
  };

  return {
    ...state,
    handleSelectAnswerClick,
    handleNextClick,
    handleBackClick,
    handleRestart,
  };
};

export default useQuestionNavigation;
