export const mockQuestions = [
  {
    id: "q1",
    question_text: "Question 1?",
    answers: [
      { id: "Yes", label: "Yes", score: 10 },
      { id: "No", label: "No", score: 20 }
    ],
    next: [{ next_question: "q2" }]
  },
  {
    id: "q2",
    question_text: "Question 2?",
    answers: [
      { id: "Yes", label: "Yes", score: 30 },
      { id: "No", label: "No", score: 40 }
    ],
    next: []
  }
];
export const mockInitialQuestionId = "q1";
