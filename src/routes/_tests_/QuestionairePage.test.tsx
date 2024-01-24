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
  test("it should render", () => {
    const { container } = render(<QuestionairePage />);

    expect(container.firstChild).toMatchSnapshot();
  });

  test("user can select an answer which enables them to click the next button", async () => {
    const { rerender } = render(<QuestionairePage />);

    expect(mockState.isAnswerSelected).toBe(false);

    const yesButton = screen.getByRole("button", { name: /yes/i });
    userEvent.click(yesButton);

    await waitFor(() => {
      expect(handleSelectAnswerClick).toHaveBeenCalled();
      expect(mockState.isAnswerSelected).toBe(true);
    });

    // Have to rerender the component to update the state of the next button
    rerender(<QuestionairePage />);

    const nextButton = screen.getByRole("button", { name: /next/i });

    expect(nextButton).toBeEnabled();

    userEvent.click(nextButton);

    await waitFor(() => {
      expect(handleNextClick).toHaveBeenCalled();
    });
  });
});
