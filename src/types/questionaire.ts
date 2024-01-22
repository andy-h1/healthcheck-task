export type QuestionaireType = {
  questions: Array<QuestionType>;
  outcomes: Array<OutcomeType>;
}
export type QuestionType = {
  id: string;
  question_text: string;
  answers: Array<Answer>;
  next: Array<NextStep>;
}

export type Answer = {
  id: string;
  label: string;
  score: number;
}

export type NextStep = {
  answered?: string;
  next_question?: string;
  max_score?: number;
  outcome?: string;
}

export type OutcomeType = {
  id: string;
  text: string;
  show_booking_button: boolean;
}
