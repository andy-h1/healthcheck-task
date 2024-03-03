import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../Header";
import * as QuestionaireContext from "../../context/QuestionaireContext";

vi.mock("../../context/QuestionaireContext", () => {
  return {
    useQuestionaireDispatch: vi.fn()
  };
});

describe("Header Component", () => {
  beforeEach(() => {
    (QuestionaireContext.useQuestionaireDispatch as vi.Mock).mockClear();
  });

  it("dispatches HANDLE_BACK action when back button is clicked", async () => {
    const mockDispatch = vi.fn();
    (QuestionaireContext.useQuestionaireDispatch as vi.Mock).mockReturnValue(
      mockDispatch
    );

    render(
      <Header findCurrentQuestionIndex={1} allQuestionsAnswered={false} />
    );
    const backButton = screen.getByRole("button");
    fireEvent.click(backButton);
    expect(mockDispatch).toHaveBeenCalledWith({ type: "HANDLE_BACK" });
  });
});
