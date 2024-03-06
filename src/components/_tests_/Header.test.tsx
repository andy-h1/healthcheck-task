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
  it("should render"),
    () => {
      const { container } = render(
        <Header findCurrentQuestionIndex={1} allQuestionsAnswered={false} />
      );

      expect(container).toMatchSnapshot();
    };
});
