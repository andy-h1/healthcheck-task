import { render } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import Header from "../Header";

const findCurrentQuestionIndex = 1;
const allQuestionsAnswered = false;

describe("Header component", () => {
  test("it should render", () => {
    const { container } = render(
      <Header
        findCurrentQuestionIndex={findCurrentQuestionIndex}
        allQuestionsAnswered={allQuestionsAnswered}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
