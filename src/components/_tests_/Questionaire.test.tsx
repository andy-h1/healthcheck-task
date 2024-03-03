import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import Questionaire from "../Questionaire";

const props = {
  question: {
    id: "heartburn_previous_treatment",
    question_text: "Have you received any treatment for heartburn previously?",
    answers: [
      { id: "heartburn_previous_treatment_yes", label: "Yes", score: 0 },
      { id: "heartburn_previous_treatment_no", label: "No", score: 0 }
    ],
    next: [{ next_question: "heartburn_weekly_burns" }]
  },
  selectedAnswerId: "",
  isAnswerSelected: false,
  onAnswerSelect: vi.fn(),
  onNext: vi.fn()
};

describe("Questionaire component", () => {
  test.todo("it should render");

  test.todo("Next button should be disabled on render");
});
