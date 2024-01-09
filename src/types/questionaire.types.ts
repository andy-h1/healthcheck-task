export interface QuestionaireType {
  questions: Array<QuestionType>;
  outcomes: Array<OutcomeType>;
}

export interface QuestionType {
  id: string;
  question_text: string;
  answers: Array<Answer>;
  next: Array<NextStep>;
}

export interface Answer {
  id: string;
  label: string;
  score: number;
}

export interface NextStep {
  answered?: string;
  next_question?: string;
  max_score?: number;
  outcome?: string;
}

export interface OutcomeType {
  id: string;
  text: string;
  show_booking_button: boolean;
}
