import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import QuestionairePage from "../QuestionairePage";
import {
  mockQuestions,
  mockInitialQuestionId
} from "../../test/utils/mockData";

let mockState = {
  currentQuestion: mockQuestions.find((q) => q.id === mockInitialQuestionId),
  selectedAnswerId: "",
  isAnswerSelected: false
};

const handleSelectAnswerClick = vi.fn((answerId) => {
  mockState = {
    ...mockState,
    selectedAnswerId: answerId,
    isAnswerSelected: true
  };
});

const handleNextClick = vi.fn();

vi.mock("../../hooks/useQuestionNavigation", () => ({
  default: vi.fn(() => ({
    ...mockState,
    handleSelectAnswerClick,
    handleNextClick
  }))
}));

describe("QuestionairePage", () => {
  test.todo("it should render");

  test.todo(
    "user can select an answer which enables them to click the next button"
  );
});
